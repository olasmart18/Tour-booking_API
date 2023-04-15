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

// get all user
exports.getAllUser = async (req, res) => {
  try {
    const foundUsers = await User.find();
    res.status(200).json({
      success: true,
      message: 'users found',
      data: foundUsers
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'not found'
    });
  }
};

// get single user by id
exports.getSingleUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const foundUser = await User.findById(userId);
    res.status(200).json({
      success: true,
      message: 'successful',
      data: foundUser
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: 'user not found'
    });
  }
};
