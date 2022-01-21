const router = require("express").Router();
const nodemailer = require('nodemailer');
const templates = require('../templates/template');

router.get('/message', (req, res, next) => {
    res.render('sendMail/message')
});

router.get('/forgotPassword', (req, res, next) => {
    res.render('sendMail/forgotPassword')
});

router.post('/forgotPassword', (req, res, next) => {
    let { email } = req.body;
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'deadstarheaven@gmail.com',
        pass: 'qqnngmikilijkoau'
      }
    });
    // const userFromDB = await User.findById(userId)
    const message = `reset your password here:`
    transporter.sendMail({
      from: '"Recover your password " <MystokHelp@project.com>',
      to: email, 
      subject: "Resset your Mystock Password", 
      text: message, //puro texto
      html: templates.templateForPassword(message)
    })
    .then(info => 
    {
      res.render('sendMail/message', {email})
    })
    .catch(error => console.log(error));
  });

module.exports = router;