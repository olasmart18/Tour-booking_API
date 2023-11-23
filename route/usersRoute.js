const express = require('express');
const route = express.Router();
const {
  getAllUser,
  getSingleUser,
  deleteSingleUser,
  deleteAll,
  updateUser
} = require('../controllers/usersController');

route.get('/users', getAllUser);
route.get('/users/:id', getSingleUser);
route.delete('/users/:id', deleteSingleUser);
route.delete('/users', deleteAll);
route.patch('/users/:id', updateUser);

module.exports = route;
