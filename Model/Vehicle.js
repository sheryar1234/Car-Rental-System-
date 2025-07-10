const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  carImage: {
    type: String,
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  rentPrice: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true, 
  },
  status: {
    type: String,
    enum: ["Available", "Reserved"],
    default: "Available",
  },
  minDriverRating: {
    type: Number,
    default: 0,
  },
 
}, { timestamps: true });


module.exports = mongoose.model('Vehicle', vehicleSchema);