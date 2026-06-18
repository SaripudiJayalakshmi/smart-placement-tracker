const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    department: { type: String, default: '' },
    batch: { type: String, default: '' },
    cgpa: { type: Number, default: 0, min: 0, max: 10 },
    aptitudeScore: { type: Number, default: 0, min: 0, max: 100 },
    codingScore: { type: Number, default: 0, min: 0, max: 100 },
    skills: [{ type: String }],
    projects: [
      {
        title: String,
        description: String,
        techStack: String,
        link: String,
      },
    ],
    internships: [
      {
        company: String,
        role: String,
        duration: String,
        description: String,
      },
    ],
    resumeUrl: { type: String, default: '' },
    isEligible: { type: Boolean, default: false },
    placementStatus: {
      type: String,
      enum: ['not_applied', 'in_process', 'placed', 'not_placed'],
      default: 'not_applied',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
