const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    googleId: {
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date
  },
  {
    timestamps: true,
  }
);

const User = new model("User", userSchema);

module.exports = User;
