const bcrypt = require("bcrypt");
const statusCode = require("http-status")

const User = require("../models/usersModel");

// register new  user
exports.createUser = async (req, res) => {
  try {
    const saltRound = bcrypt.genSaltSync(10);
    const password = req.body.password; // user password
    const hash = bcrypt.hashSync(password, saltRound); // hash password
    const isUser = await User.findOne({
      email: req.body.email,
    });
    if (isUser) {
      res.status(statusCode.BAD_REQUEST).json({
        message: "user already exist, please login",
      });
    } else {
      // create new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
      });
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
