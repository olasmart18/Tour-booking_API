const express = require('express');

const route = express.Router();
const { register, login } = require('../controllers/authController');

// route.get();
route.post('/api/auth/register', register);
route.post('/api/auth/login', login);

module.exports = route;
