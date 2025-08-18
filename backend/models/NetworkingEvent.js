const mongoose = require('mongoose');

const NetworkingEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  eventType: { type: String, enum: ['In-Person', 'Virtual', 'Hybrid'], required: true },
  location: { 
    type: String,
    required: function() {
      return this.eventType === 'In-Person' || this.eventType === 'Hybrid';
    }
  },
  virtualLink: { 
    type: String,
    required: function() {
      return this.eventType === 'Virtual' || this.eventType === 'Hybrid';
    }
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  image: { type: String },
  capacity: { type: Number, min: 1 },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  speakers: [{ type: String }],
  attendees: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['attending', 'declined'], required: true },
    registrationDate: { type: Date, default: Date.now }
  }],
  published: { type: Boolean, default: false },
  notificationSent: { type: Boolean, default: false }, // Track if notification was sent to alumni
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('networkingEvent', NetworkingEventSchema);