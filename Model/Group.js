const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  members: [{
    type: String, // Changed to String for emails
    required: true,
    trim: true,
    lowercase: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for better performance
groupSchema.index({ members: 1 });
groupSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Group', groupSchema);