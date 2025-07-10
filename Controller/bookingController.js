const Booking = require("../Model/Booking");
const Vehicle = require("../Model/Vehicle");
const User = require("../Model/CustomerUser");
const fs = require("fs");
const path = require("path");

// Create a new booking
const createBooking = async (req, res) => {
  const { fromDate, toDate, vehicleId, carImage, vehicleName, totalCost, userEmail } = req.body;

  // Check if required files exist
  if (!req.files || !req.files["licenseImage"] || !req.files["idCardImage"]) {
    return res.status(400).json({ message: "License image and ID card image are required" });
  }

  const licenseImage = req.files["licenseImage"][0].path;
  const idCardImage = req.files["idCardImage"][0].path;

  // Check if paymentReceipt exists
  const paymentReceipt = req.files["paymentReceipt"] ? req.files["paymentReceipt"][0].path : null;

  try {
    // Check if the vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Check if the user exists by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create the booking
    const booking = new Booking({
      fromDate,
      toDate,
      licenseImage,
      idCardImage,
      paymentReceipt, // This can be null if not provided
      carImage,
      vehicleId,
      vehicleName,
      userEmail,
      renterEmail: vehicle.email, // Add renterEmail from the vehicle
      userId: user._id,
      totalCost,
    });

    await booking.save();

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get bookings for a specific user by email
const getUserBookings = async (req, res) => {
  try {
    const userEmail = req.query.userEmail; // Get user email from query parameters
    if (!userEmail) {
      return res.status(400).json({ message: "User email is required" });
    }

    const bookings = await Booking.find({ userEmail }).populate("vehicleId"); // Populate vehicle details
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};

const getBookingReq = async (req, res) => {
    try {
      const renterEmail = req.query.renterEmail; // Get renter email from query parameters
      if (!renterEmail) {
        return res.status(400).json({ message: "Renter email is required" });
      }
  
      // Fetch bookings by renterEmail and status = "Pending"
      const bookings = await Booking.find({ renterEmail, status: "Pending" }).populate("vehicleId");
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching bookings", error });
    }
  };

  const getConfirmedBooking = async (req, res) => {
    try {
      const renterEmail = req.query.renterEmail; // Get renter email from query parameters
      if (!renterEmail) {
        return res.status(400).json({ message: "Renter email is required" });
      }
  
      
      const bookings = await Booking.find({ renterEmail, status: "Confirmed" }).populate("vehicleId");
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching bookings", error });
    }
  };


  const getRecievedBooking = async (req, res) => {
    try {
      const renterEmail = req.query.renterEmail; // Get renter email from query parameters
      if (!renterEmail) {
        return res.status(400).json({ message: "Renter email is required" });
      }
  
      
      const bookings = await Booking.find({ renterEmail, status: "Received" }).populate("vehicleId");
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching bookings", error });
    }
  };


  const updateBookingStatus = async (req, res) => {
    const { bookingId } = req.params;
    const { status } = req.body;
  
    try {
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { status },
        { new: true }
      );
  
      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
  
      res.status(200).json({ success: true, message: "Booking status updated", booking });
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  const getBookingByVehicleAndUser = async (req, res) => {
    const { vehicleId, userEmail } = req.query;
  
    try {
      const booking = await Booking.findOne({ vehicleId, userEmail });
      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found." });
      }
  
      res.status(200).json({ success: true, booking });
    } catch (error) {
      console.error("Error fetching booking:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  };
  
// Export both functions
module.exports = { createBooking, getUserBookings,getBookingReq,updateBookingStatus,getConfirmedBooking,getRecievedBooking };