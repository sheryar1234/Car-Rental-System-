import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import VehicleRating from "./VehicleRating"; // Import the rating component

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const userEmail = localStorage.getItem("userEmail");

      if (!userEmail) {
        alert("User is not authenticated. Please log in.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/user", {
          params: { userEmail },
        });
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        alert("Failed to fetch bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <div>Loading bookings...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="">
        <h1 className="text-2xl font-bold mb-6 text-center">Your Bookings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
              <img
                src={booking.carImage}
                alt={booking.vehicleName}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{booking.vehicleName}</h2>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">From:</span> {new Date(booking.fromDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">To:</span> {new Date(booking.toDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`${
                    booking.status === "Confirmed"
                      ? "text-green-600"
                      : booking.status === "Cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  } font-semibold`}
                >
                  {booking.status === "Received" ? "Returned" : booking.status}
                </span>
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Total Cost:</span> Rs {booking.totalCost}
              </p>
              {/* Conditionally render the rating component */}
              {booking.status === "Received" && (
                <VehicleRating vehicleId={booking.vehicleId} userEmail={booking.userEmail} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bookings;