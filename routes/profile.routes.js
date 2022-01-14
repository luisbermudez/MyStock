const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const mongoose = require('mongoose');
const { loggedIn, loggedOut } = require('../middleware/route-guard');
const req = require("express/lib/request");
const Upload = require('../helper/multer');
const async = require("hbs/lib/async");


//userProfile
router.get('/user-profile', loggedIn, (req, res, next) =>{
    console.log("HERE:", req.session.currentUser);
    res.render('user/user-profile', {userIn: req.session.currentUser})
});

//userEdit
router.get('/user-edit', loggedIn, (req,res, next) => {
    res.render('user/user-edit', {userIn: req.session.currentUser});
});

router.post('/userProfile/:userId/edit', loggedIn, Upload.single("profilePicture"), async (req,res,next) => {
    const { userId } = req.params;
    const { nameCompany, email, ... rest } = req.body;
    let picture;
    

    try{
        if(req.file) {
            picture = req.file.path
            const userFromDB = await User.findByIdAndUpdate(
                userId, 
                { 
                    nameCompany,
                    email,
                    profilePicture: picture
                },
                {
                new: true
                }
            );
            req.session.currentUser = userFromDB;
            return res.redirect('/user-profile');
        }else{
            const userFromDB = await User.findByIdAndUpdate(
                userId, 
                { 
                    nameCompany,
                    email,
                },
                {
                new: true
                }
            );
            req.session.currentUser = userFromDB;
            return res.redirect('/user-profile');
        }
    }catch(err){
        console.log(err);
        next(err);
    }

    //res.render('user/user-edit', {userIn: req.session.currentUser})
});

//edit password
router.get('/edit-pass', loggedIn, async(req,res, next) => {
    const { userId } = req.body;
    try{
        const userFromDB = await User.findById(userId)
        res.render('user/private/edit-pass', {userIn: req.session.currentUser});
    }catch(err){
        console.log(err)
        next(err);
    }
});

router.post('edit-pass', loggedIn, async(req, res, next) => {


}) 



router.get("/home", loggedIn, (req, res, next) => res.render("user/home"));

module.exports = router;