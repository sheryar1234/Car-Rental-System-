const express = require('express');
const { updateVehicle,deleteVehicle,getVehiclesByEmail,addVehicle, getVehicles,searchVehicles } = require('../Controller/vehicleController');
const upload = require('../Middleware/uploadMiddleware');
const { updateVehicleStatus } = require("../Controller/vehicleController");
const router = express.Router();
const { rateVehicle,getAverageRating } = require('../Controller/vehicleController');

router.put("/update-status", updateVehicleStatus);
router.post('/add', upload.single('carImage'), addVehicle);
router.get('/all', getVehicles);
router.get('/car', searchVehicles);
router.get('/by-email', getVehiclesByEmail);
router.delete('/delete/:id', deleteVehicle);

router.put('/update/:id', upload.single('carImage'), updateVehicle);
// Rate a vehicle
router.post('/rate', rateVehicle);


// Get average rating for a vehicle
router.get('/average-rating/:vehicleId', getAverageRating);
module.exports = router;
