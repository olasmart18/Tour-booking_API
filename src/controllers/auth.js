const bcrypt = require('bcrypt');
const crypto = require('crypto');
const statusCode = require('http-status');
const User = require('../models/usersModel');
const {sendMail} = require('../utils/nodemailer');
const CustomError = require('../middlewares/error');
const {asyncWrapper} = require('../utils/asyncWrapper');
const passport = require('passport');

// Register new  user
exports.createUser = asyncWrapper(async (req, res, next) => {
  const saltRound = bcrypt.genSaltSync(10);
  const {password} = req.body; // User password
  const role = 'user'; // User or admin
  let newUser;
  const hash = bcrypt.hashSync(password, saltRound); // Hash password
  const isUser = await User.findOne({
    email: req.body.email,
  });
  if (isUser) {
    const error = new CustomError(
      'user already exist, please login',
      statusCode.BAD_REQUEST,
    );
    return next(error);
  }

  if (req.originalUrl === '/api/auth/admin/register') {
    // Create user as an admin
    newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      role: 'admin',
    });
  } else {
    // Create new user
    newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      role,
    });
  }

  await newUser.save();
  return res.status(statusCode.CREATED).json({
    message: 'succesfully created',
    data: newUser,
  });
});

// Login user
exports.login = asyncWrapper(async (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      const error = new CustomError(
        'email or password not correct, please provide valid email and password',
        statusCode.NOT_FOUND,
      );
      return next(error);
    }

    // Here, we use req.login(user) to establish a login session
    req.login(user, err => {
      if (err) {
        return next(err);
      }

      res.status(statusCode.OK).json({
        message: 'successfully logged in as ' + user.username,
      });
    });
  })(req, res, next);
});

// Google auth route
exports.googleAuth = asyncWrapper(async (req, res, next) =>
  passport.authenticate('google', {scope: ['email', 'profile']})(
    req,
    res,
    next,
  ),
);

// Google auth callback route
exports.googleAuthCallBack = asyncWrapper(async (req, res, next) => {
  passport.authenticate('google', (err, user) => {
    if (err) {
      const error = new CustomError(
        'Internal server error during login',
        statusCode.INTERNAL_SERVER_ERROR,
      );
      return next(error);
    }

    if (!user) {
      const error = new CustomError(
        'Authentication error',
        statusCode.NOT_FOUND,
      );
      return next(error);
    }

    req.login(user, err => {
      if (err) {
        const error = new CustomError(
          'Internal server error during login',
          statusCode.INTERNAL_SERVER_ERROR,
        );
        return next(error);
      }

      res.status(statusCode.CREATED).json({
        message: 'successful logged in',
      });
    });
  })(req, res, next);
});
// Logout route
exports.logout = asyncWrapper(async (req, res, next) => {
  // Passport function to log the user out
  req.logout(err => {
    if (err) {
      const error = new CustomError(
        'Internal server error during login',
        statusCode.INTERNAL_SERVER_ERROR,
      );
      return next(error);
    }

    // Destroy the session, including clearing the session cookie
    req.session.destroy(err => {
      if (!err) {
        // Clear the user's session cookie
        res.clearCookie('connect.sid');

        return res.status(statusCode.OK).json({
          message: 'looged out succefully',
        });
      }

      const error = new CustomError(
        'Internal server error during login',
        statusCode.INTERNAL_SERVER_ERROR,
      );
      return next(error);
    });
  });
});

// Forgot password route
exports.forgotPassword = asyncWrapper(async (req, res, next) => {
  const isUser = await User.findOne({email: req.body.email});
  if (!isUser) {
    const error = new CustomError('usr not found', 404);
    return next(error);
  }

  const token = crypto.randomBytes(32).toString('hex');
  const accessToken = crypto.createHash('sha256').update(token).digest('hex');

  isUser.passwordResetToken = accessToken;
  isUser.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Expires in 10mins
  const resetUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/auth/resetPassword/${token}`;
  const message = `you have make request to reset your password, please click the link below \n\n ${resetUrl}`;
  await isUser.save({validateBeforeSave: false});

  // Send password reset link to user email
  try {
    await sendMail({
      sender: 'olasmartTech&co@mail.com',
      subject: 'password reset recieved',
      email: isUser.email,
      message,
    });
    res.status(statusCode.CREATED).json({
      message: 'successful',
      link: message,
    });
  } catch (err) {
    (isUser.passwordResetToken = undefined),
    (isUser.passwordResetExpires = undefined),
    isUser.save({validateBeforeSave: false});
    const error = new CustomError(err.message, 400);
    return next(error);
  }
});

// Password reset route
exports.resetPassword = asyncWrapper(async (req, res, next) => {
  const {token} = req.params;
  const {password} = req.body;

  // Encrypt token to compare to saved token in DB
  const isToken = crypto.createHash('sha256').update(token).digest('hex');

  // Hash password provided by user before save
  const saltRound = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, saltRound);

  // Find user in the database
  const user = await User.findOne({
    passwordResetToken: isToken,
    passwordResetExpires: {$gte: Date.now()},
  });
  if (!user) {
    const error = new CustomError('not found or token has eexpired', 404);
    return next(error);
  }

  (user.password = hash),
  (user.passwordResetToken = undefined),
  (user.passwordResetExpires = undefined),
  (user.passwordChangedAt = Date.now());
  // Save instance of user
  await user.save({validateBeforeSave: false});
  return res.status(statusCode.CREATED).json({
    message: 'password reset successfully',
  });
});
