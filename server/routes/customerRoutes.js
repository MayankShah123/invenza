const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

// Apply auth middleware to all customer routes
router.use(authMiddleware);

// POST /api/customers
router.post('/', customerController.createCustomer);

// GET /api/customers
router.get('/', customerController.getCustomers);

// GET /api/customers/:id
router.get('/:id', customerController.getCustomerById);

// PUT /api/customers/:id
router.put('/:id', customerController.updateCustomer);

// DELETE /api/customers/:id
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;