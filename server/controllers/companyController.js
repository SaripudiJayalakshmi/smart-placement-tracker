const Company = require('../models/Company');

const getAllCompanies = async (req, res) => {
  const companies = await Company.find({ isActive: true }).sort('-createdAt');
  res.json({ success: true, count: companies.length, data: companies });
};

const getCompany = async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) { res.status(404); throw new Error('Company not found'); }
  res.json({ success: true, data: company });
};

const createCompany = async (req, res) => {
  const company = await Company.create(req.body);
  res.status(201).json({ success: true, message: 'Company created', data: company });
};

const updateCompany = async (req, res) => {
  const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!company) { res.status(404); throw new Error('Company not found'); }
  res.json({ success: true, message: 'Company updated', data: company });
};

const deleteCompany = async (req, res) => {
  const company = await Company.findByIdAndDelete(req.params.id);
  if (!company) { res.status(404); throw new Error('Company not found'); }
  res.json({ success: true, message: 'Company deleted' });
};

module.exports = { getAllCompanies, getCompany, createCompany, updateCompany, deleteCompany };