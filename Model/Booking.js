const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  licenseImage: { type: String, required: true },
  idCardImage: { type: String, required: true },
  paymentReceipt: { type: String },
  carImage: { type: String, required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  vehicleName: { type: String, required: true },
  userEmail: { type: String, required: true },
  renterEmail: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled","Returned"],
    default: "Pending",
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalCost: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Ensure the model is exported correctly
module.exports = mongoose.model("Booking", bookingSchema);