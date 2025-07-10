import React, { useEffect, useState } from "react";
import axios from "axios";
import RenterNavbar from "./RenterNavbar";
import StarRating from "./StarRating"; // Import the StarRating component

const ConfirmedBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
 // Function to handle "Received Vehicle back" button click
 const handleReceivedVehicle = (bookingId, userEmail) => {
  setSelectedBooking({ bookingId, userEmail });
  setShowRatingModal(true);
};
  useEffect(() => {
    
    const fetchBookings = async () => {
      const renterEmail = localStorage.getItem("userEmail");

      if (!renterEmail) {
        alert("User is not authenticated. Please log in.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/confirmedBookings", {
          params: { renterEmail },
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
  }, [ handleReceivedVehicle]);

 

  // Function to submit the rating and update the booking status
  const handleRatingSubmit = async (rating) => {
    try {
      const { bookingId, userEmail } = selectedBooking;
  
      // Submit the driver rating
      await axios.post("http://localhost:5000/api/driverRatings", {
        driverEmail: userEmail,
        rating: parseFloat(rating),
      });
  
      // Update the booking status to "Received"
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        status: "Received",
      });
  
      // Update the local state to reflect the new status
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status: "Received" } : booking
        )
      );
  
      // Find the vehicleId associated with the booking
      const booking = bookings.find((booking) => booking._id === bookingId);
      if (booking && booking.vehicleId) {
        // Update the vehicle status to "Available"
        await axios.put("http://localhost:5000/api/vehicles/update-status", {
          vehicleId: booking.vehicleId,
          status: "Available",
        });
      }
  
    } catch (error) {
      console.error("Error updating booking status or submitting rating:", error);
      alert("Failed to update booking status or submit rating. Please try again.");
    } finally {
      setShowRatingModal(false);
    }
  };
  const openImage = (imageUrl) => {
    const fullImageUrl = `http://localhost:5000/${imageUrl}`;
    window.open(fullImageUrl, "_blank");
  };

  if (loading) {
    return <div>Loading bookings...</div>;
  }
  return (
    <div>
      <RenterNavbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Confirmed Bookings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-lg p-4">
              <img
                src={`${booking.carImage}`}
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
                  {booking.status}
                </span>
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Total Cost:</span> Rs {booking.totalCost}
              </p>
              <div className="flex space-x-1">
                <button
                  onClick={() => openImage(booking.licenseImage)}
                  className="bg-slate-800 transition-all text-sm text-white px-6 py-2 hover:bg-cyan-600 rounded-lg"
                >
                  License
                </button>
                <button
                  onClick={() => openImage(booking.idCardImage)}
                  className="bg-slate-800 transition-all text-sm text-white px-6 py-2 hover:bg-cyan-600 rounded-lg"
                >
                  ID Card
                </button>
              
                <button
                  onClick={() => openImage(booking.paymentReceipt)}
                  className="bg-slate-800 transition-all text-sm  text-white px-2 hover:bg-cyan-600 rounded-lg"
                >
                  Show Payment Recipt
                </button>
              </div>
              <hr className="my-3"/>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => handleReceivedVehicle(booking._id, booking.userEmail)} // Use userEmail as driverEmail
                  className="w-full mt-2 bg-cyan-600 font-bold text-white py-2 rounded-lg border border-transparent text-center text-sm transition-all shadow-md hover:shadow-lg focus:shadow-none active:bg-cyan-700 hover:bg-cyan-700 active:shadow-none"
                >
                  Vehicle Returned
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Star Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Rate the Driver</h2>
            <StarRating onRatingSubmit={handleRatingSubmit} />
            <button
              onClick={() => setShowRatingModal(false)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmedBookings;