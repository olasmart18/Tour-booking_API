const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
// const statusCode = require("http-status");
const User = require("../models/usersModel");
// create passort strategy
const passport = async (passport) => {
  passport.use(
    new localStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        const isUser = await User.findOne({ email: email });
        if (!isUser) {
          return done(null, false, {
            message: "user not found, please sign Up",
          });
        } else {
          // check password matching with bcrypt
          try {
            const pwdMatch = bcrypt.compareSync(password, isUser.password);
            if (pwdMatch) {
              return done(null, isUser, {
                message: "successfully logged in as " + isUser.username,
              });
            } else {
              return done(null, false, {
                message: "incorrect password or username",
              });
            }
          } catch (err) {
            return done(null, false, {
              message: err.message,
            });
          }
        }
      }
    )
  );

  // serialize user
  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });

  // deserialize user
  passport.deserializeUser(async (id, done) => {
    try {
      await User.findById(id).then((user) => {
        return done(null, user);
      });
    } catch (err) {
      return done(null, false, {
        message: err.message,
      });
    }
  });
};

module.exports = passport;
