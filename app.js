// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");
const path = require("path");

const app = express();

// Session app require
require('./config/session.config')(app);

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const projectName = "projectNumberTwo";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const auth = require("./routes/auth.routes");
app.use("/", auth);

const items = require('./routes/items.route');
app.use('/', items);

const collection = require('./routes/collection.routes');
app.use('/', collection);

const profile = require('./routes/profile.routes');
app.use('/', profile);

const sendMail = require('./routes/sendMail.routes');
app.use('/', sendMail);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

// Google sign up
const passport = require("passport");
const User = require("./models/User.model");

passport.serializeUser((user, cb) => cb(null, user._id));

passport.deserializeUser((id, cb) => {
  User.findById(id)
    .then((user) => cb(null, user))
    .catch((err) => cb(err));
});

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {

      User.findOne({ googleID: profile.id })
        .then((user) => {
          if (user) {
            done(null, user);
            return;
          }

          User.create({
            googleID: profile.id,
            nameCompany: profile.displayName,
            email: profile.emails[0].value,
            password: "00NAna",
            profilePicture: profile.photos[0].value,
          })
            .then((newUser) => {
              done(null, newUser);
            })
            .catch((err) => done(err)); // closes User.create()
        })
        .catch((err) => done(err)); // closes User.findOne()
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

// Register partials
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

hbs.registerPartials(__dirname + "/views/partials");

module.exports = app;
