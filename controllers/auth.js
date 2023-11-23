const bcrypt = require("bcrypt");
const crypto = require("crypto");
const statusCode = require("http-status");
const User = require("../models/usersModel");
const sendMail = require("../utils/nodemailer").sendMail;
const passport = require("passport");

// register new  user
exports.createUser = async (req, res) => {
  try {
    const saltRound = bcrypt.genSaltSync(10);
    const password = req.body.password; // user password
    let role = "user"; // user or admin
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
      } else {
        // create new user
        newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hash,
          role: role,
        });
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
          message: "not a user or incorrect password",
        });
      } else {
        // Here, we use req.login(user) to establish a login session
        req.login(user, (err) => {
          if (err) {
            return next(err);
          }
          res.status(statusCode.OK).json({
            message: "successfully looged in as " + user.username,
          });
        });
      }
    }
  })(req, res, next);
};

// google auth route
exports.googleAuth = async (req, res, next) => {
  return passport.authenticate("google", { scope: ["email", "profile"] })(
    req,
    res,
    next
  );
};

// google auth callback route
exports.googleAuthCallBack = async (req, res, next) => {
  passport.authenticate("google", (err, user) => {
    if (err) {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal server error, " + err.message,
      });
    } else {
      if (!user) {
        return res.status(statusCode.BAD_REQUEST).json({
          message: "Authentication error",
        });
      } else {
        req.login(user, (err) => {
          if (!err) {
            res.status(statusCode.CREATED).json({
              message: "successful logged in",
            });
          } else {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
              message: "Internal server error during login",
            });
          }
        });
      }
    }
  })(req, res, next);
};

// logout route
exports.logout = async (req, res) => {
  try {
    // Passport function to log the user out
    req.logout((err) => {
      if (err) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
          message: "an error has occure trying to logout," + err.message,
        });
      }
      // Destroy the session, including clearing the session cookie
      req.session.destroy((err) => {
        if (!err) {
          // Clear the user's session cookie
          res.clearCookie("connect.sid");

          return res.status(statusCode.OK).json({
            message: "looged out succefully",
          });
        }
        return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
          message: "an error occure trying to logout," + err.message,
        });
      });
    });
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong: " + err,
    });
  }
};

// forgot password route
exports.forgotPassword = async (req, res) => {
  try {
    const isUser = await User.findOne({ email: req.body.email });
    if (!isUser) {
      return res.status(statusCode.NOT_FOUND).json({
        message: "not a valid user, user not found",
      });
    }
    const token = crypto.randomBytes(32).toString("hex");
    const accessToken = crypto.createHash("sha256").update(token).digest("hex");

    isUser.passwordResetToken = accessToken;
    isUser.passwordResetExpires = Date.now() + 10 * 60 * 1000; // expires in 10mins
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/resetPassword/${token}`;
    const message = `you have make request to reset your password, please click the link below \n\n ${resetUrl}`;
    await isUser.save({ validateBeforeSave: false });

    // send password reset link to user email
    try {
      await sendMail({
        sender: "olasmartTech&co@mail.com",
        subject: "password reset recieved",
        email: isUser.email,
        message: message,
      });
      res.status(statusCode.CREATED).json({
        message: "successful",
        link: message,
      });
    } catch (err) {
      (isUser.passwordResetToken = undefined),
        (isUser.passwordResetExpires = undefined),
        isUser.save({ validateBeforeSave: false });
      return res.status(statusCode.BAD_REQUEST).json({
        message: err.message,
      });
    }
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

// password reset route
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // encrypt token to compare to saved token in DB
    const isToken = crypto.createHash("sha256").update(token).digest("hex");

    // hash password provided by user before save
    const saltRound = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, saltRound);

    // find user in the database
    const user = await User.findOne({
      passwordResetToken: isToken,
      passwordResetExpires: { $gte: Date.now() },
    });
    if (!user) {
      return res.status(statusCode.NOT_FOUND).json({
        message: "not found or token has eexpired",
      });
    }
    (user.password = hash),
      (user.passwordResetToken = undefined),
      (user.passwordResetExpires = undefined),
      (user.passwordChangedAt = Date.now());
    // save instance of user
    await user.save({ validateBeforeSave: false });
    return res.status(statusCode.CREATED).json({
      message: "password reset successfully",
    });
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};
