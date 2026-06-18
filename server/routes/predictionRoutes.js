const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getPrediction } = require('../controllers/predictionController');

router.get('/', protect, getPrediction);

module.exports = router;