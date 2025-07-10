const express = require('express');
const { customerSignup, customerLogin } = require('../Controller/CustomerAuthController');
const { renterSignup, renterLogin } = require('../Controller/RenterAuthController');
const { getAllCustomers, deleteCustomer,toggleCustomerStatus } = require('../Controller/CustomerController');
const { getAllRenters, deleteRenter, toggleRenterStatus } = require('../Controller/RenterController');
const {adminSignup, adminLogin } = require('../Controller/AdminAuthController');
const router = express.Router();

router.get('/customers', getAllCustomers);
router.delete('/customer/:id', deleteCustomer);
router.patch('/customer/:id/toggle-status', toggleCustomerStatus);
// Signup route
router.post('/customer-signup', customerSignup);

// Login route
router.post('/customer-login', customerLogin);


// Renter routes (if needed for your application)
router.post('/renter-signup', renterSignup);
router.post('/renter-login', renterLogin);

router.post('/admin-signup', adminSignup);
router.post('/admin-login', adminLogin);

router.get('/renters', getAllRenters);
router.delete('/renter/:id', deleteRenter);
router.patch('/renter/:id/toggle-status', toggleRenterStatus);

module.exports = router;
