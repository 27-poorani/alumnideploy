const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DonationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  message: {
    type: String
  },
  paymentDetails: {
    lastFourDigits: {
      type: String
    },
    // In a real application, you would store more payment details
    // or integrate with a payment gateway
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'rejected'],
    default: 'pending'
  },
  adminNotes: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('donation', DonationSchema);