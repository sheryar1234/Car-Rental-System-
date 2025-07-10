const DriverRating = require("../Model/DriverRating");

// Submit a driver rating
const submitDriverRating = async (req, res) => {
  const { driverEmail, rating } = req.body;

  try {
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const driverRating = new DriverRating({ driverEmail, rating });
    await driverRating.save();

    res.status(201).json({ message: "Rating submitted successfully", driverRating });
  } catch (error) {
    console.error("Error submitting driver rating:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Calculate the average rating for a driver
const getAverageDriverRating = async (req, res) => {
    const { driverEmail } = req.query;
  
    try {
      const ratings = await DriverRating.find({ driverEmail });
      if (ratings.length === 0) {
        return res.status(200).json({ averageRating: 5 }); // Default to 0 if no ratings exist
      }
  
      const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
      const averageRating = totalRating / ratings.length;
      res.status(200).json({ averageRating });
    } catch (error) {
      res.status(500).json({ message: "Error fetching driver rating", error });
    }
  };

module.exports = { submitDriverRating, getAverageDriverRating };