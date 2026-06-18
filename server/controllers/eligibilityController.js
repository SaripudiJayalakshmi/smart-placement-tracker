const Company = require('../models/Company');
const Student = require('../models/Student');

const checkEligibility = async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });

  if (!student) {
    res.status(404);
    throw new Error('Student profile not found');
  }

  const companies = await Company.find({ isActive: true });

  const results = companies.map(company => {
    const checks = {
      cgpa: {
        required: company.minCGPA,
        actual: student.cgpa,
        passed: student.cgpa >= company.minCGPA,
        label: 'CGPA',
      },
      aptitude: {
        required: company.minAptitudeScore,
        actual: student.aptitudeScore,
        passed: student.aptitudeScore >= company.minAptitudeScore,
        label: 'Aptitude Score',
      },
      coding: {
        required: company.minCodingScore,
        actual: student.codingScore,
        passed: student.codingScore >= company.minCodingScore,
        label: 'Coding Score',
      },
    };

    const matchedSkills = company.requiredSkills.filter(skill =>
      student.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
    );
    const missingSkills = company.requiredSkills.filter(skill =>
      !student.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
    );

    const skillCheck = {
      required: company.requiredSkills,
      matched: matchedSkills,
      missing: missingSkills,
      passed: missingSkills.length === 0,
      label: 'Required Skills',
    };

    const allPassed = Object.values(checks).every(c => c.passed) && skillCheck.passed;

    return {
      company: {
        _id: company._id,
        name: company.name,
        sector: company.sector,
        package: company.package,
        location: company.location,
        openRoles: company.openRoles,
      },
      eligible: allPassed,
      checks,
      skillCheck,
    };
  });

  const eligible = results.filter(r => r.eligible);
  const notEligible = results.filter(r => !r.eligible);

  await Student.findOneAndUpdate(
    { user: req.user._id },
    { isEligible: eligible.length > 0 }
  );

  res.json({
    success: true,
    summary: {
      total: companies.length,
      eligible: eligible.length,
      notEligible: notEligible.length,
    },
    data: { eligible, notEligible },
  });
};

module.exports = { checkEligibility };