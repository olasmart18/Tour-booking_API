const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');

// register new user
exports.register = async (req, res) => {
  const password = req.body.password;
  const email = req.body.email;

  // hash password before saving in db
  const saltRound = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, saltRound);

  // check if user already exist before saving to db
  const userExist = await User.findOne({ email: email });
  if (!userExist) {
    const NewReg = new User({
      email: email,
      password: hash,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      age: req.body.age,
      gender: req.body.gender
    });
    try {
      const saveReg = await NewReg.save();
      return res.status(200).json({
        success: true,
        message: 'successful',
        data: saveReg
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Oops! , something went wrong, try again'
      });
    }
  }
  return res.status(400).json({
    success: false,
    message: 'user already exist, please logIn'
  });
};

// login user
exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    // check if user exist
    const userExist = await User.findOne({ email: email });

    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: 'user does not exist, please register'
      });
    }
    // compare password
    const PwdMatch = bcrypt.compareSync(password, userExist.password);
    // if user exit, check if password matching user password
    if (!PwdMatch) {
      return res.status(404).json({
        success: false,
        message: 'incorrect user or password'
      });
    }
    // create a token
    const token = jwt.sign({ id: User._id, role: User.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '2d' });
    return res.cookie('accessToken', token, {
      expires: token.expiresIn,
      httpOnly: true
    }).status(200).json({
      success: true,
      message: 'successfully logged in'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'error!, something went wrong while signing in'
    });
  }
};
