const express = require('express');
const route = express.Router();
const {
  createUser,
  getAllUser,
  getSingleUser,
  deleteSingleUser,
  deleteAll,
  updateUser
} = require('../controllers/usersController');

route.post('/api/users', createUser);
route.get('/api/users', getAllUser);
route.get('/api/users/:id', getSingleUser);
route.delete('/api/users/:id', deleteSingleUser);
route.delete('/api/users', deleteAll);
route.patch('/api/users/:id', updateUser);
module.exports = route;
