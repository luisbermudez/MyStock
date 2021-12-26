const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const mongoose = require('mongoose');

router.get("/signup", (req, res, next) => res.render("auth/signup"));

router.post("/signup", async (req, res, next) => {
    const { nameCompany, email, password } =req.body;

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res.status(500).render("auth/signup", {
            errorMessage:
            "Password must be at least 6 characters and contain at least one number, and uppercase letter."
        });
        return;
    }

    try {
        const salt = bcryptjs.genSaltSync(saltRounds);
        const passwordHash = bcryptjs.hashSync(password, salt);

        const user = await User.create({ nameCompany, email, password: passwordHash });
        res.redirect("/login");
    } catch(error) {
        if(error instanceof mongoose.Error.ValidationError) {

            // Cutting first part of mongoose error message
            const shortenedError = error.message.split("$")[1];

            res.status(500).render("auth/signup", { errorMessage: shortenedError });
        } else 
        if(error.code === 11000) {
            res.status(500).render("auth/signup", { errorMessage: "This email has already been registered. Please, try with a different onemptied." })
        } else {
            next(error);
        }
    }
});

router.get("/login", (req, res, next) => res.render("auth/login"));

module.exports = router;
