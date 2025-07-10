const RenterUser = require('../Model/RenterUser');

// Get all renters
const getAllRenters = async (req, res) => {
  try {
    const renters = await RenterUser.find();
    res.status(200).json(renters);
  } catch (error) {
    console.error('Error fetching renters:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a renter
const deleteRenter = async (req, res) => {
  try {
    const { id } = req.params;
    const renter = await RenterUser.findByIdAndDelete(id);
    if (!renter) {
      return res.status(404).json({ message: 'Renter not found' });
    }
    res.status(200).json({ message: 'Renter deleted successfully' });
  } catch (error) {
    console.error('Error deleting renter:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle renter status
const toggleRenterStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const renter = await RenterUser.findById(id);

    if (!renter) {
      return res.status(404).json({ message: 'Renter not found' });
    }

    renter.isAllowed = !renter.isAllowed; // Toggle status
    await renter.save();

    const status = renter.isAllowed ? 'allowed' : 'disallowed';
    res.status(200).json({ message: `Renter is now ${status}` });
  } catch (error) {
    console.error('Error toggling renter status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllRenters, deleteRenter, toggleRenterStatus };
