// routes/preferenceRoutes.js
const express = require('express');
const { preferenceController } = require('../controllers/preferenceController');

const router = express.Router();

router.get('/add-preference', preferenceController.addPreference);
router.get('/update-preference', preferenceController.updatePreference);
module.exports = router;
