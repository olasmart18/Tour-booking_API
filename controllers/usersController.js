const User = require('../models/usersModel');

// create new userr
exports.createUser = async (req, res) => {
  const newUser = new User(req.body);
  try {
    const savedUser = await newUser.save();
    res.status(200).json({
      success: true,
      message: 'successful',
      data: savedUser
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'something went wrong, ty again'
    });
  }
};
