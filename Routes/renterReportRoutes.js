const express = require('express');
const router = express.Router();
const reportController = require('../Controller/RenterReportController');

router.post('/reports', reportController.createReport);
router.get('/reports', reportController.getReports);
router.get('/reports/:email', reportController.getReportsByEmail);
router.put('/reports/:id', reportController.updateReport);

module.exports = router;