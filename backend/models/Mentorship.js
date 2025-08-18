const mongoose = require('mongoose');

const MentorshipSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  expertise: [{ type: String }],
  availability: { type: String, required: true },
  maxMentees: { type: Number, default: 5 },
  currentMentees: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  approved: { type: Boolean, default: false }, // Admin approval
  featured: { type: Boolean, default: false }, // For homepage display
  adminMessage: { type: String },
  proposedDates: [{ type: Date }],
  selectedDate: { type: Date },
  finalThanked: { type: Boolean, default: false },
  mentees: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    requestMessage: { type: String },
    requestDate: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Mentorship', MentorshipSchema);