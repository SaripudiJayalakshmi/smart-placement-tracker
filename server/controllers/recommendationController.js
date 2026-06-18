const axios = require('axios');
const Student = require('../models/Student');
const Company = require('../models/Company');

const getRecommendations = async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });
  if (!student) {
    res.status(404);
    throw new Error('Student profile not found');
  }

  const companies = await Company.find({ isActive: true });

  const payload = {
    skills: student.skills || [],
    cgpa: student.cgpa || 0,
    aptitudeScore: student.aptitudeScore || 0,
    codingScore: student.codingScore || 0,
    companies: companies.map(c => ({
      _id: c._id,
      name: c.name,
      sector: c.sector,
      package: c.package,
      location: c.location,
      requiredSkills: c.requiredSkills,
      minCGPA: c.minCGPA,
      minAptitudeScore: c.minAptitudeScore,
      minCodingScore: c.minCodingScore,
    })),
  };

  try {
    const { data } = await axios.post('http://localhost:5001/recommend', payload);
    res.json({ success: true, data: data.recommendations });
  } catch (error) {
    res.status(503);
    throw new Error('ML service unavailable');
  }
};

module.exports = { getRecommendations };