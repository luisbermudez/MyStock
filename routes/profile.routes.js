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
    
    // const { userId } = req.body;
    // const { newPassword, confirmPassword } = req.body;


    // try {
    //     if(newPassword != confirmPassword){
    //         res.status(500).render ("private/edit-pass",{
    //             errorMessage: "The password does no match "
    //         });
    //         const userFromDB = await User.findByIdAndUpdate(
    //             userId,
    //             {
    //                 password
    //             },
    //             { new: true }
    //         );
            
    //         const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    //         if (!regex.test(password)) {
    //             res.status(500).render("auth/signup", {
    //                 confirmPassword: "password",
    //                 errorMessage:
    //                     "Password must be at least 6 characters long and contain at least one number, and uppercase letter."
    //             });
    //             return;
    //         }
    //         return res.redirect (`/user-profile/${userFromDB._id}`);
    //     }else{
    //     }
    // } catch (err) {
    //     console.log(err);
    //     next(err);
    // }

}) 



router.get("/home", loggedIn, (req, res, next) => res.render("user/home"));

module.exports = router;