const mongoose = require('mongoose');

const TopStudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  package: { type: String, required: true },
  batch: { type: String, required: true },
  photo: { type: String },
});

module.exports = mongoose.model('TopStudent', TopStudentSchema); 