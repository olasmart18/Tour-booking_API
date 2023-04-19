const express = require('express');

const route = express.Router();
const { register } = require('../controllers/authController');

// route.get();
route.post('/api/auth/register', register);

module.exports = route;
