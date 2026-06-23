const Student = require('../models/Student');
const fs = require('fs');
const path = require('path');

const uploadResume = async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a PDF file');
  }

  const baseUrl = process.env.BASE_URL || `http://localhost:5000`;
  const resumeUrl = `${baseUrl}/uploads/${req.file.filename}`;

  const student = await Student.findOneAndUpdate(
    { user: req.user._id },
    { resumeUrl },
    { new: true }
  );

  res.json({
    success: true,
    message: 'Resume uploaded successfully',
    resumeUrl: student.resumeUrl,
  });
};

const deleteResume = async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });

  if (student.resumeUrl) {
    try {
      if (student.resumeUrl.includes('localhost')) {
        const filename = student.resumeUrl.split('/uploads/')[1];
        const filePath = path.join(__dirname, '..', 'uploads', filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.log('File delete error (ignored):', err.message);
    }
  }

  student.resumeUrl = '';
  await student.save();
  res.json({ success: true, message: 'Resume deleted' });
};

const getResume = async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });
  res.json({ success: true, resumeUrl: student?.resumeUrl || '' });
};

module.exports = { uploadResume, deleteResume, getResume };