const mongoose = require('mongoose');
const db = 'tourDB';
const connect = async (req, res, next) => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}${db}`);
    console.log('connected to db');
  } catch (error) {
    console.log(error);
  }
};
module.exports = connect;
