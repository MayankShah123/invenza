const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  name: { type: String, required: true },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: true,
  },
});

const invoiceSchema = new mongoose.Schema({
  user_id: { // <-- Changed from 'user'
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Customer',
  },
  items: [invoiceItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Paid', 'Overdue'],
    default: 'Pending',
  },
  invoiceDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;