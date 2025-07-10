const express = require("express");
const router = express.Router();
const { updateBookingStatus } = require("../controllers/bookingController");

router.put("/bookings/:id/status", updateBookingStatus);

module.exports = router;