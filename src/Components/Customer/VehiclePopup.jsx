import React, { useEffect, useState } from "react";
import axios from "axios";

const VehiclePopup = ({ vehicle, onClose }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/vehicles/average-rating/${vehicle._id}`
        );
        if (response.data.success) {
          setAverageRating(response.data.averageRating);
        }
      } catch (error) {
        console.error("Error fetching average rating:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAverageRating();
  }, [vehicle._id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-3/4 md:w-2/5 shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-2 right-2 text-gray-500 text-2xl hover:text-black z-10"
          onClick={onClose}
        >
          ✕
        </button>
        <img
          src={vehicle.carImage}
          alt={vehicle.name}
          className="w-full h-60 object-cover rounded-lg mb-4"
        />
        <div className="flex">
          <h2 className="text-xl font-semibold text-gray-800">{vehicle.name}</h2>
          <div className="ml-auto">
            {loading ? (
              <p className="text-gray-600">Loading rating...</p>
            ) : (
              <div className="">
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-2xl ${
                        star <= averageRating ? "text-yellow-500" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-600">{vehicle.description}</p>
        </div>
      </div>
    </div>
  );
};

export default VehiclePopup;