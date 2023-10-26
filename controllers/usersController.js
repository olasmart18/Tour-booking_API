const User = require('../models/usersModel');

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

// delete single user
exports.deleteSingleUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const delUser = await User.findByIdAndDelete(userId);
    res.status(200).json({
      success: true,
      message: 'successful',
      data: `user with ${delUser._id} ID has been deleted`
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'something went wrong, try again'
    });
  }
};

// delete all user
exports.deleteAll = async (req, res) => {
  try {
    await User.deleteMany();
    res.status(200).json({
      success: true,
      message: 'successful'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'something went wrong, try again'
    });
  }
};

// update user
exports.updateUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId,
      { $set: req.body }, { new: true });
    res.status(200).json({
      success: true,
      message: 'successful',
      data: updatedUser
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'something went wrong, try again'
    });
  }
};
