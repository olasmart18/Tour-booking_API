const localStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
// const statusCode = require("http-status");
const { User, OtherUser } = require("../models/usersModel");

// create passort local strategy
const localPassport = async (passport) => {
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

// passport Google strategy
const googlePassport = async (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.callbackURL,
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        const user = await OtherUser.findOne({ googleId: profile.id });
        console.log(profile);
        if (user) {
          return done(null, user);
        } else {
          try {
             await new OtherUser({
            googleId: profile.id,
            role: "user"
          })
            .save()
            .then((user) => {
              return done(null, user);
            });
          } catch (err) {
            return done(err, null)
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

module.exports = { localPassport , googlePassport };
