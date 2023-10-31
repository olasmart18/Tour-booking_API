const bcrypt = require("bcrypt");
const statusCode = require("http-status");
const User = require("../models/usersModel");
const passport = require("passport");

// register new  user
exports.createUser = async (req, res) => {
  try {
    const saltRound = bcrypt.genSaltSync(10);
    const password = req.body.password; // user password
    let role = "user";
    let newUser;
    const hash = bcrypt.hashSync(password, saltRound); // hash password
    const isUser = await User.findOne({
      email: req.body.email,
    });
    if (isUser) {
      res.status(statusCode.BAD_REQUEST).json({
        message: "user already exist, please login",
      });
    } else {
      if (req.originalUrl === "/api/auth/admin/register") {
        // create user as an admin
         newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hash,
          role: "admin",
        });
        console.log("1")
      } else {
        // create new user
         newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        role: role,
      });
      console.log("2")
      }
      await newUser.save();
      return res.status(statusCode.CREATED).json({
        message: "succesfully created",
        data: newUser,
      });
    }
  } catch (err) {
    res.status().json({
      message: err.message,
    });
  }
};

// login user
exports.login = async (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err);
    } else {
      if (!user) {
        res.status(statusCode.NOT_FOUND).json({
          message: "user not found",
        });
      } else {
        // Here, we use req.login(user) to establish a login session
        req.login(user, (err) => {
          if (err) {
            return next(err);
          }
          console.log(user)
          res.status(statusCode.OK).json({
            message: "successfully looged in as " + user.username,
          });
        });
      }
    }
  })(req, res, next)
};
