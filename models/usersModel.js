const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  firstName: {
    type: String,
    reqiured: true
  },
  lastName: {
    type: String,
    required: true
  },
  // phone: {
  //   type: BigInt,
  //   required: true,
  //   unique: true
  // },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  age: Number,
  gender: String
}, {
  timestamps: true
});

const User = new model('User', userSchema);

module.exports = User;
