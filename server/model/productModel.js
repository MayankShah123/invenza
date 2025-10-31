const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  user_id: { // <-- Changed from 'user'
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
  },
  sku: { // <-- Changed from 'stock'
    type: String,
    required: [true, 'SKU is required'],
    unique: true, // <-- Added this, your controller checks for duplicates
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;