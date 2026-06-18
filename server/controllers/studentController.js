const Student = require('../models/Student');

const getMyProfile = async (req, res) => {
  const student = await Student.findOne({ user: req.user._id }).populate('user', 'name email');
  if (!student) {
    res.status(404);
    throw new Error('Student profile not found');
  }
  res.json({ success: true, data: student });
};

const updateMyProfile = async (req, res) => {
  const { department, batch, cgpa, aptitudeScore, codingScore, skills } = req.body;

  const student = await Student.findOneAndUpdate(
    { user: req.user._id },
    { department, batch, cgpa, aptitudeScore, codingScore, skills },
    { new: true, runValidators: true }
  );

  if (!student) {
    res.status(404);
    throw new Error('Student profile not found');
  }

  res.json({ success: true, message: 'Profile updated', data: student });
};

const addProject = async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });
  student.projects.push(req.body);
  await student.save();
  res.json({ success: true, message: 'Project added', data: student });
};

const deleteProject = async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });
  student.projects = student.projects.filter(p => p._id.toString() !== req.params.id);
  await student.save();
  res.json({ success: true, message: 'Project deleted', data: student });
};

const addInternship = async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });
  student.internships.push(req.body);
  await student.save();
  res.json({ success: true, message: 'Internship added', data: student });
};

const deleteInternship = async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });
  student.internships = student.internships.filter(i => i._id.toString() !== req.params.id);
  await student.save();
  res.json({ success: true, message: 'Internship deleted', data: student });
};

const getAllStudents = async (req, res) => {
  const students = await Student.find().populate('user', 'name email');
  res.json({ success: true, count: students.length, data: students });
};

module.exports = { getMyProfile, updateMyProfile, addProject, deleteProject, addInternship, deleteInternship, getAllStudents };
