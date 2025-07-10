const express = require("express");
const router = express.Router();
const { submitDriverRating, getAverageDriverRating } = require("../Controller/driverRatingController");

router.post("/driverRatings", submitDriverRating);
router.get("/average", getAverageDriverRating);

module.exports = router;