const User = require("../models/usersModel");
const CustomError = require("../middlewares/error");
const asyncWrapper = require("../utils/asyncWrapper").asyncWrapper;

// get all user
exports.getAllUser = asyncWrapper(async (req, res, next) => {
  const foundUsers = await User.find({});
  if (!foundUsers) {
    const error = new CustomError("No user found", 404);
    next(error);
  }
  res.status(200).json({
    success: true,
    message: "users found",
    data: foundUsers,
  });
});

// get single user by id
exports.getSingleUser = asyncWrapper(async (req, res, next) => {
  const userId = req.params.id;
  const foundUser = await User.findById(userId);
  if (!foundUser) {
    const error = new CustomError("No user found", 404);
    next(error);
  }
  res.status(200).json({
    success: true,
    message: "successful",
    data: foundUser,
  });
});

// delete single user
exports.deleteSingleUser = asyncWrapper(async (req, res) => {
  const userId = req.params.id;
  const delUser = await User.findByIdAndDelete(userId);
  if (!delUser) {
    const error = new CustomError("No user found", 404);
    next(error);
  }
  res.status(200).json({
    success: true,
    message: "successful",
    data: `user with ${delUser._id} ID has been deleted`,
  });
});

// delete all user
exports.deleteAll = asyncWrapper(async (req, res) => {
  await User.deleteMany();
  res.status(200).json({
    success: true,
    message: "successful",
  });
});

// update user
exports.updateUser = asyncWrapper(async (req, res) => {
  const userId = req.params.id;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: req.body },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "successful",
    data: updatedUser,
  });
});
