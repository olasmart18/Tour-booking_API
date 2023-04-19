const bcrypt = require('bcryptjs');
const User = require('../models/usersModel');

exports.register = async (req, res) => {
  const password = req.body.password;
  const email = req.body.email;

  const saltRound = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, saltRound);

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

exports.login = async (req, res) => {

};
