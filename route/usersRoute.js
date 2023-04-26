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
const verifyUser = require('../util/verify').verifyUser;
const verifyAdmin = require('../util/verify').verifyAdmin;

route.post('/users', createUser);
route.get('/users', verifyAdmin, getAllUser);
route.get('/users/:id', verifyUser, getSingleUser);
route.delete('/users/:id', verifyUser, deleteSingleUser);
route.delete('/users', verifyAdmin, deleteAll);
route.patch('/users/:id', verifyUser, updateUser);
module.exports = route;
