import React, { useState } from "react";
import axios from "axios";

const VehicleRating = ({ vehicleId, userEmail }) => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const handleRatingSubmit = async () => {
    // Validate inputs
    if (!vehicleId) {
      setMessage("Error: Vehicle ID is missing.");
      return;
    }
    if (!userEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      setMessage("Error: Valid user email is required.");
      return;
    }
    if (rating < 1 || rating > 5) {
      setMessage("Error: Please select a rating between 1 and 5.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/vehicles/rate", {
        vehicleId,
        userEmail,
        rating,
      });

      if (response.data.success) {
        setMessage("Thank you for rating this vehicle!");
      } else {
        setMessage(response.data.message || "Failed to submit rating.");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      // Log detailed server response if available
      if (error.response) {
        console.error("Server response:", error.response.data);
        setMessage(error.response.data.message || "Failed to submit rating. Please try again.");
      } else {
        setMessage("Failed to connect to the server. Please try again.");
      }
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Rate this Vehicle</h3>
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-2xl ${rating >= star ? "text-yellow-500" : "text-gray-300"}`}
          >
            ★
          </button>
        ))}
      </div>
      <button
        onClick={handleRatingSubmit}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Submit Rating
      </button>
      {message && (
        <p className={`mt-2 ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default VehicleRating;