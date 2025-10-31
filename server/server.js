const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const customerRoutes = require('./routes/customerRoutes.js'); // <-- ADD THIS
const invoiceRoutes = require('./routes/invoiceRoutes.js'); // <-- ADD THIS

const app = express();
const PORT = process.env.PORT || 8080;

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

// --- Middleware ---
app.use(cors()); // Allow requests from any origin
app.use(express.json()); // Parse JSON request bodies

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes); // <-- ADD THIS
app.use('/api/invoices', invoiceRoutes); // <-- ADD THIS

// Simple test route
app.get('/', (req, res) => {
  res.send('Billing & Inventory API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});