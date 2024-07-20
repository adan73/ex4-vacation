const express = require('express');
const { addUser } = require('../controllers/userController'); // Ensure this path is correct
const user_router = express.Router();

user_router.get('/add-user', addUser);

module.exports = user_router;
