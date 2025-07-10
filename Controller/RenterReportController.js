const Report = require('../Model/RenterReport');

// Create a new report
exports.createReport = async (req, res) => {
  const newReport = new Report(req.body);
  try {
    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all reports (for admin)
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reports by email (for job seeker)
exports.getReportsByEmail = async (req, res) => {
  try {
    const reports = await Report.find({ email: req.params.email });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a report's status and reply message
exports.updateReport = async (req, res) => {
  try {
    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, replyMessage: req.body.replyMessage },
      { new: true }
    );
    res.json(updatedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};