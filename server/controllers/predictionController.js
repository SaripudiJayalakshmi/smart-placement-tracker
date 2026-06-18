const axios = require('axios');
const Student = require('../models/Student');

const getPrediction = async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });

  if (!student) {
    res.status(404);
    throw new Error('Student profile not found');
  }

  const payload = {
    cgpa: student.cgpa || 0,
    aptitudeScore: student.aptitudeScore || 0,
    codingScore: student.codingScore || 0,
    projectsCount: student.projects?.length || 0,
    internshipsCount: student.internships?.length || 0,
    skillsCount: student.skills?.length || 0,
    backlogs: 0,
  };

  try {
    const { data } = await axios.post('http://localhost:5001/predict', payload);
    res.json({ success: true, data: data.prediction });
  } catch (error) {
    res.status(503);
    throw new Error('ML service unavailable. Make sure Flask server is running.');
  }
};

module.exports = { getPrediction };