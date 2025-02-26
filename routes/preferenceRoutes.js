// routes/preferenceRoutes.js
const express = require('express');
const { preferenceController } = require('../controllers/preferenceController');

const router = express.Router();
//the couldn't put post in the add and update i have a problem , so i have to put them on get so it work
router.get('/add-preference', preferenceController.addPreference);
router.get('/update-preference', preferenceController.updatePreference);
router.get('/delete-preference', preferenceController.deletePreference);
router.get('/get-all-preference', preferenceController.getAllPreference);
router.get('/get-specific-preference', preferenceController.getSpecificPreference);
router.get('/get-the-result', preferenceController.getPreferenceResult);



module.exports = router;
