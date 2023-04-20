const express = require('express');

const route = express.Router();
const { register, login } = require('../controllers/authController');

// route.get();
route.post('/auth/register', register);
route.post('/auth/login', login);

module.exports = route;
