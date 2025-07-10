import React, { useEffect, useState } from "react";
import axios from "axios";
import RenterNavbar from "./RenterNavbar";

const BookingRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "" // 'success' or 'error'
  });

  // Show notification function
  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });
    
    setTimeout(() => {
      setNotification(prev => ({...prev, show: false}));
    }, 5000);
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      // Update the booking status
      const bookingResponse = await axios.put(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        status,
      });

      if (bookingResponse.data.success) {
        // Update the local state to reflect the new status
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId ? { ...booking, status } : booking
          )
        );

        // If the booking is confirmed, update the vehicle status to "Reserved"
        if (status === "Confirmed") {
          const vehicleId = bookings.find((booking) => booking._id === bookingId).vehicleId;
          await axios.put("http://localhost:5000/api/vehicles/update-status", {
            vehicleId,
            status: "Reserved",
          });
        }

        showNotification(`Booking ${status.toLowerCase()} successfully!`, "success");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      showNotification("Failed to update booking status. Please try again.", "error");
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      const renterEmail = localStorage.getItem("userEmail"); // Retrieve renter email from localStorage

      if (!renterEmail) {
        showNotification("User is not authenticated. Please log in.", "error");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/bookingRequests", {
          params: { renterEmail }, // Send renter email as a query parameter
        });
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        showNotification("Failed to fetch bookings. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Function to open image in a new tab
  const openImage = (imageUrl) => {
    const fullImageUrl = `http://localhost:5000/${imageUrl}`;
    window.open(fullImageUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <RenterNavbar />
      
      {/* Notification */}
      <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-out ${
        notification.show ? "translate-y-0" : "-translate-y-full"
      }`}>
        {notification.show && (
          <div className={`mt-4 px-6 py-4 rounded-lg shadow-lg ${
            notification.type === "success" 
              ? "bg-green-100 border-green-400 text-green-700" 
              : "bg-red-100 border-red-400 text-red-700"
          } border-l-4 flex items-center`}>
            {notification.type === "success" ? (
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Booking Requests</h1>
        {bookings.length === 0 ? (
          <div className="text-center py-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="mt-4 text-lg text-gray-600">No booking requests found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
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
                    {booking.status}
                  </span>
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="font-medium">Total Cost:</span> Rs {booking.totalCost}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => openImage(booking.licenseImage)}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition"
                  >
                    View License
                  </button>
                  <button
                    onClick={() => openImage(booking.idCardImage)}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition"
                  >
                    View ID Card
                  </button>
                  <button
                    onClick={() => openImage(booking.paymentReceipt)}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition"
                  >
                    View Receipt
                  </button>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => updateBookingStatus(booking._id, "Confirmed")}
                    className={`flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-green-700 transition ${
                      booking.status === "Confirmed" ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={booking.status === "Confirmed"}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => updateBookingStatus(booking._id, "Cancelled")}
                    className={`flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-red-700 transition ${
                      booking.status === "Cancelled" ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={booking.status === "Cancelled"}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingRequests;