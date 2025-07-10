const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);