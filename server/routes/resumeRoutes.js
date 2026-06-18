const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const { uploadResume, deleteResume, getResume } = require('../controllers/resumeController');

router.get('/', protect, getResume);
router.post('/upload', protect, upload.single('resume'), uploadResume);
router.delete('/', protect, deleteResume);

module.exports = router;
