const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  age: Number,
  gender: String
}, {
  timestamps: true
});

const User = new model('User', userSchema);

module.exports = User;
