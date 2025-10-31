const Product = require('../model/productModel.js');

// Create a new product
// POST /api/products
exports.createProduct = async (req, res) => {
  try {
    // user_id now comes from the auth middleware
    const user_id = req.user.id; // .id is a getter for ._id
    
    const { name, sku, price } = req.body;
    if (!name || !sku || !price) {
      return res.status(400).json({ message: 'Missing required fields: name, sku, price' });
    }

    const newProduct = new Product({
      ...req.body,
      user_id: user_id, // Ensure user_id is set from the token
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    if (error.code === 11000) { // Handle duplicate SKU
      return res.status(409).json({ message: 'Error: This SKU already exists.' });
    }
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// Get all products for the logged-in user
// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ user_id: req.user.id });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Get a single product by ID
// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Update a product
// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    // Ensure user_id cannot be changed
    delete req.body.user_id; 
    
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.id }, // Find by ID and user_id
      req.body,
      { new: true } // Return the updated document
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete a product
// DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ _id: req.params.id, user_id: req.user.id });
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// NOTE: Your controller uses `exports.createProduct`.
// Make sure your `productRoutes.js` file imports this correctly, like:
// const { createProduct, ... } = require('../controllers/productController.js');
// router.route('/').post(protect, createProduct).get(protect, getProducts);
// etc.