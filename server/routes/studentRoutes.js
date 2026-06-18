const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getMyProfile, updateMyProfile,
  addProject, deleteProject,
  addInternship, deleteInternship,
  getAllStudents
} = require('../controllers/studentController');

router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);
router.post('/me/projects', protect, addProject);
router.delete('/me/projects/:id', protect, deleteProject);
router.post('/me/internships', protect, addInternship);
router.delete('/me/internships/:id', protect, deleteInternship);
router.get('/', protect, adminOnly, getAllStudents);

module.exports = router;
