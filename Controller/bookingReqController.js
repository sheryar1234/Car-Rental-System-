
const Booking = require("../Model/Booking");

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    // Validate status
    if (!["Pending", "Confirmed", "Cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    // Update booking status in the database
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
module.exports = { updateBookingStatus};