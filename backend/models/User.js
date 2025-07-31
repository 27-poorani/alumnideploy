const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['alumni', 'admin'], default: 'alumni' },
  batch: { type: String },
  company: { type: String },
  salary: { type: String },
  designation: { type: String },
  location: { type: String },
  phone: { type: String },
  linkedin: { type: String },
  photo: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema); 