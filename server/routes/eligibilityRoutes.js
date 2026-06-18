const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { checkEligibility } = require('../controllers/eligibilityController');

router.get('/check', protect, checkEligibility);

module.exports = router;