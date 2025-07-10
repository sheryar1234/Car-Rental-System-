const mongoose = require("mongoose");

const driverRatingSchema = new mongoose.Schema({
  driverEmail: { type: String, required: true }, // Email of the driver
  rating: { type: Number, required: true, min: 1, max: 5 }, // Rating out of 5
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

module.exports = mongoose.model("DriverRating", driverRatingSchema);