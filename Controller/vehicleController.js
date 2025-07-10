const Vehicle = require('../Model/Vehicle');
const path = require('path');
const Rating = require('../Model/Rating'); 
// Add Vehicle
const addVehicle = async (req, res) => {
  try {
    const { email, make, model, name, location, rentPrice, description, status, minDriverRating } = req.body;
    const carImage = req.file.path;

    const newVehicle = new Vehicle({ email, carImage, make, model, name, location, rentPrice, description, status, minDriverRating });
    await newVehicle.save();

    res.status(201).json({ message: 'Vehicle added successfully', vehicle: newVehicle });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update Vehicle Status
const updateVehicleStatus = async (req, res) => {
  const { vehicleId, status } = req.body;

  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      vehicleId,
      { status },
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    res.status(200).json({ success: true, message: "Vehicle status updated", vehicle });
  } catch (error) {
    console.error("Error updating vehicle status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get Vehicles
const getVehicles = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads`;
    const vehicles = await Vehicle.find();

    const vehiclesWithImageUrls = vehicles.map(vehicle => ({
      ...vehicle._doc,
      carImage: vehicle.carImage ? `${baseUrl}/${path.basename(vehicle.carImage)}` : null,
    }));

    res.status(200).json(vehiclesWithImageUrls);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Search Vehicles by Name
const searchVehicles = async (req, res) => {
  try {
    const { name, location, maxPrice } = req.query;

    if (!name && !location && !maxPrice) {
      return res.status(400).json({ message: "Please provide at least one search parameter (name, location, or maxPrice)." });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}/uploads`;

    const filters = {};
    if (name) filters.name = { $regex: name, $options: "i" };
    if (location) filters.location = { $regex: location, $options: "i" };
    if (maxPrice) filters.rentPrice = { $lte: parseFloat(maxPrice) };

    const vehicles = await Vehicle.find(filters);

    const vehiclesWithImageUrls = vehicles.map(vehicle => ({
      ...vehicle._doc,
      carImage: vehicle.carImage ? `${baseUrl}/${path.basename(vehicle.carImage)}` : null,
    }));

    if (vehiclesWithImageUrls.length === 0) {
      return res.status(404).json({ message: "No vehicles found matching the criteria." });
    }

    res.status(200).json(vehiclesWithImageUrls);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get Vehicles by Email
const getVehiclesByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}/uploads`;
    const vehicles = await Vehicle.find({ email });

    const vehiclesWithImageUrls = vehicles.map(vehicle => ({
      ...vehicle._doc,
      carImage: vehicle.carImage ? `${baseUrl}/${path.basename(vehicle.carImage)}` : null,
    }));

    res.status(200).json(vehiclesWithImageUrls);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete Vehicle by ID
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVehicle = await Vehicle.findByIdAndDelete(id);

    if (!deletedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update Vehicle by ID
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    if (req.file) {
      updatedData.carImage = req.file.path;
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ message: "Vehicle updated successfully", updatedVehicle });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Import the Rating model

// Rate a vehicle
const rateVehicle = async (req, res) => {
  const { vehicleId, userEmail, rating } = req.body;

  try {
    // Check if the vehicle exists
    const vehicle = await Vehicle.findById(vehicleId._id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    // Check if the user has already rated this vehicle
    const existingRating = await Rating.findOne({ vehicleId, userEmail });
    if (existingRating) {
      return res.status(400).json({ success: false, message: "You have already rated this vehicle" });
    }

    // Create a new rating
    const newRating = new Rating({ vehicleId, userEmail, rating });
    await newRating.save();

    res.status(201).json({ success: true, message: "Vehicle rated successfully", newRating });
  } catch (error) {
    console.error("Error rating vehicle:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Calculate average rating for a vehicle
const getAverageRating = async (req, res) => {
  const { vehicleId } = req.params;

  try {
    // Find all ratings for the vehicle
    const ratings = await Rating.find({ vehicleId });

    if (ratings.length === 0) {
      return res.status(200).json({ success: true, averageRating: 5 });
    }

    // Calculate the average rating
    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRating / ratings.length;

    res.status(200).json({ success: true, averageRating });
  } catch (error) {
    console.error("Error calculating average rating:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// Export all functions
module.exports = {
  addVehicle,
  updateVehicleStatus,
  getVehicles,
  searchVehicles,
  getVehiclesByEmail,
  deleteVehicle,
  updateVehicle,
  rateVehicle,
  getAverageRating,
};