const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  institutionType: {
    type: String,
    enum: ['school', 'college', 'university'],
    required: true
  },
  institutionName: String,
  studyPeriod: {
    startDate: Date,
    endDate: Date
  },
  degree: String,
  result: String
});

const platformSchema = new mongoose.Schema({
  serialNumber: Number,
  platformName: String,
  link: String
});

const projectSchema = new mongoose.Schema({
  priority: Number,
  title: String,
  description: String,
  liveLink: String,
  githubLink: String
});

const profileSchema = new mongoose.Schema({
  profileImage: String,
  coverPhoto: String,
  name: String,
  dateOfBirth: Date,
  fatherName: String,
  motherName: String,
  contactNumber: String,
  email: String,
  whatsapp: String,
  gmail: String,
  homeAddress: String,
  countries: [String],
  region: String,
  education: {
    school: educationSchema,
    college: educationSchema,
    university: educationSchema
  },
  sscResult: String,
  hscResult: String,
  universityResult: String,
  platforms: [platformSchema],
  projects: [projectSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);
