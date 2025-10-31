const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

// Apply the auth middleware to ALL routes in this file
// A user MUST be logged in to access any /api/products endpoint
router.use(authMiddleware);

// POST a new product
router.post('/', productController.createProduct);

// GET all products for a user
router.get('/', productController.getProducts);

// GET a single product by its ID
router.get('/:id', productController.getProductById);

// UPDATE a product by its ID
router.put('/:id', productController.updateProduct);

// DELETE a product by its ID
router.delete('/:id', productController.deleteProduct);

module.exports = router;