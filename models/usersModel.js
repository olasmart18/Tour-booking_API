const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

otherUserSchema = new Schema({
  googleId: {
    type: String,
  },
  role: {
    type: String,
  },
});

const User = new model("User", userSchema);
const OtherUser = new model("OtherUser", otherUserSchema);

module.exports = { User, OtherUser };
