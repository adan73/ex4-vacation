// routes/preferenceRoutes.js
const express = require('express');
const { preferenceController } = require('../controllers/preferenceController');

const router = express.Router();

router.get('/add-preference', preferenceController.addPreference);

module.exports = router;
