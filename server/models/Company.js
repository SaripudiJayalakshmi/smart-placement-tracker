const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Company name is required'], trim: true },
    description: { type: String, default: '' },
    sector: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    package: { type: Number, required: [true, 'Package is required'], min: 0 },
    minCGPA: { type: Number, required: [true, 'Minimum CGPA is required'], min: 0, max: 10 },
    minAptitudeScore: { type: Number, default: 0, min: 0, max: 100 },
    minCodingScore: { type: Number, default: 0, min: 0, max: 100 },
    requiredSkills: [{ type: String }],
    openRoles: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);