const router = require("express").Router();
const nodemailer = require('nodemailer');
const templates = require('../templates/template');
const User = require("../models/User.model");
const async = require("hbs/lib/async");
const { update } = require("../models/User.model");
const bcryptjs = require('bcryptjs');

router.get('/message', (req, res, next) => {
    res.render('sendMail/message')
});

//resetPassword
router.get('/resetPassword/:id', async(req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if(user){
    // req.session.userId = id;
    const userId = user._id;
    // console.log("elsuserid", userId)
    res.render('sendMail/resetPassword', { userIn: userId})
  }else{
    res.render('sendMail/resetPassword', { errorMessage: "Sorry there was an error, we can't find your user"})
  }
});

router.post('/resetPassword/:id', async(req, res, next) => {
  const { id } = req.params;

  const { newPassword, confirmPassword } = req.body;
  console.log("erroor?", req.body, req.session.currentUser)
  try{
      if(newPassword !== confirmPassword){
          return res.render(`sendMail/resetPassword`, {errorMessage: 'Your password does not match'})
      }
      const salt = bcryptjs.genSaltSync(10);
      const passwordHash = bcryptjs.hashSync(newPassword, salt);
      const updatedPassword = await User.findByIdAndUpdate(
          id,
        {
          password: passwordHash
        },
        { new: true }
      );
      console.log("const update", updatedPassword)
      return res.redirect(`/login`);
  } catch(err){
    res.render(`sendMail/resetPassword`, {errorMessage: 'Sorry we have a problem'})
  }
})

//ForgotPassword
router.get('/forgotPassword', (req, res, next) => {
    res.render('sendMail/forgotPassword')
});

router.post('/forgotPassword', async(req, res, next) => {
    try{
      let { email } = req.body;
      const user = await User.findOne({email})
      console.log("eluser", user)
    if(!user){
      res.render("sendMail/forgotPassword/", { errorMessage: "Error the email doesn't exist"})
    }
    if (user){
      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'deadstarheaven@gmail.com',
          pass: 'qqnngmikilijkoau'
        }
      });
      const dynamicTemplateData = {
        url: `https://inventoryapp-2.herokuapp.com/resetPassword/${user._id}`,
        email: user.email,
        name: user.nameCompany,
        message: `reset your password here:`,
      };
      transporter.sendMail({
        from: '"Recover your password " <MystokHelp@project.com>',
        to: email, 
        subject: "Resset your Mystock Password", 
        text: dynamicTemplateData.message, //puro texto
        html: templates.templateForPassword(dynamicTemplateData)
      })
      .then(info => 
      {
        res.render('sendMail/message', {email})
      })
      .catch(error => console.log(error));
    }
  
    }catch(err){
      console.log("error", err)
      next(err)
    }
  });

module.exports = router;