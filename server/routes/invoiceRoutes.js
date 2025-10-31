const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

// Apply auth middleware to all invoice routes
router.use(authMiddleware);

// POST /api/invoices
router.post('/', invoiceController.createInvoice);

// GET /api/invoices
router.get('/', invoiceController.getInvoices);

// GET /api/invoices/:id
router.get('/:id', invoiceController.getInvoiceById);

// PUT /api/invoices/:id
router.put('/:id', invoiceController.updateInvoice);

// DELETE /api/invoices/:id
router.delete('/:id', invoiceController.deleteInvoice);

module.exports = router;