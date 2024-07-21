// routes/preferenceRoutes.js
const express = require('express');
const { preferenceController } = require('../controllers/preferenceController');

const router = express.Router();

router.get('/add-preference', preferenceController.addPreference);
router.get('/update-preference', preferenceController.updatePreference);
router.get('/delete-preference', preferenceController.deletePreference);
router.get('/get-all-preference', preferenceController.getAllPreference);


module.exports = router;
