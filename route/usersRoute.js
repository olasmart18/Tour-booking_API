const express = require('express');
const route = express.Router();
const {
  createUser,
  getAllUser,
  getSingleUser
} = require('../controllers/usersController');

route.post('/api/users', createUser);
route.get('/api/users', getAllUser);
route.get('/api/users/:id', getSingleUser);
module.exports = route;
