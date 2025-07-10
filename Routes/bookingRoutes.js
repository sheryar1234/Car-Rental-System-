const express = require("express");
const router = express.Router();
const { createBooking, getUserBookings,getBookingReq,updateBookingStatus,getConfirmedBooking ,getRecievedBooking} = require("../Controller/bookingController");
const multer = require("multer");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/bookings",
  upload.fields([
    { name: "licenseImage", maxCount: 1 },
    { name: "idCardImage", maxCount: 1 },
    { name: "paymentReceipt", maxCount: 1 },
  // Add carImage to the list of files
  ]),
  createBooking
);

router.get("/user", getUserBookings);
router.get("/bookingRequests", getBookingReq);
router.get("/confirmedBookings", getConfirmedBooking);
router.get("/recievedBookings", getRecievedBooking);
router.put("/bookings/:bookingId/status", updateBookingStatus);

module.exports = router;