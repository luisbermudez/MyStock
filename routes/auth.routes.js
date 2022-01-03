const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const mongoose = require('mongoose');

router.get("/signup", (req, res, next) => res.render("auth/signup"));

router.post("/signup", async (req, res, next) => {
    const { nameCompany, email, password } = req.body;

    try {
        // Check if the email the user has entered is already registered
        const emailLocate = await User.findOne({ email });
        // If the email is not registered, go ahead and validate password
        if (!emailLocate) {
            const regexEmail = /^\S+@\S+\.\S+$/;
            if(!regexEmail.test(email)) {
                res.status(500).render("auth/signup", {
                    emailField: "email",
                    name: nameCompany,
                    email: email,
                    errorMessage: "Please enter a valid email address.",
                });
                return;
            }

            const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
            if (!regex.test(password)) {
                res.status(500).render("auth/signup", {
                    passwordField: "password",
                    name: nameCompany,
                    email: email,
                    errorMessage:
                        "Password must be at least 6 characters long and contain at least one number, and uppercase letter."
                });
                return;
            }
        }

        const salt = bcryptjs.genSaltSync(saltRounds);
        const passwordHash = bcryptjs.hashSync(password, salt);

        const user = await User.create({
        nameCompany,
        email,
        password: passwordHash,
        });

        res.redirect("/login");
    } catch(error) {
        if(error instanceof mongoose.Error.ValidationError) {

            // Cutting first part of mongoose error message
            const shortenedError = error.message.split("$")[1];
            res.status(500).render("auth/signup", {
                nameField: "name",
                name: nameCompany,
                email: email,
                errorMessage: shortenedError 
            });
        } else 
        if(error.code === 11000) {
            res.status(500).render("auth/signup", { 
                emailField: "email",
                name: nameCompany,
                email: email,
                errorMessage: "This email has already been registered. Please, try with a different one." 
            })
        } else {
            next(error);
        }
    }
});

router.get("/login", (req, res, next) => res.render("auth/login"));

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  try {
      const userFromDB = await User.findOne({ email });
      if (!userFromDB) {
          res.render("auth/login", {
            emailInp: email,
            errorMessage:
              "Email not registered. Try again with a different email or sign up.",
          });
          return;
      } else if (bcryptjs.compareSync(password, userFromDB.password)) {
          req.session.currentUser = userFromDB;
          res.redirect("/home");
      } else {
          res.render("auth/login", {
            emailInp: email,
            errorMessage: "Incorrect password.",
          });
          return;
      }
  } catch(error) {
      next(error);
  }
});

router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if(err) next(err);
        res.redirect('/landpage');
    })
})

router.get("/home", (req, res, next) => res.render("user/home"));

module.exports = router;
