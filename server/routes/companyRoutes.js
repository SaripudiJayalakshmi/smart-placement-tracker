const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getAllCompanies, getCompany, createCompany, updateCompany, deleteCompany } = require('../controllers/companyController');

router.get('/', protect, getAllCompanies);
router.get('/:id', protect, getCompany);
router.post('/', protect, adminOnly, createCompany);
router.put('/:id', protect, adminOnly, updateCompany);
router.delete('/:id', protect, adminOnly, deleteCompany);

module.exports = router;