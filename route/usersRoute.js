const express = require('express');
const route = express.Router();
const {
  createUser,
  getAllUser,
  getSingleUser,
  deleteSingleUser
} = require('../controllers/usersController');

route.post('/api/users', createUser);
route.get('/api/users', getAllUser);
route.get('/api/users/:id', getSingleUser);
route.delete('/api/users/:id', deleteSingleUser);
module.exports = route;
