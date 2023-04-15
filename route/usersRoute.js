const express = require('express');
const route = express.Router();
const { createUser } = require('../controllers/usersController');

route.post('/api/users/', createUser);
module.exports = route;
