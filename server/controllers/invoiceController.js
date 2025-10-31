const Invoice = require('../model/invoiceModel.js');
const Product = require('../model/productModel.js');

// @desc    Get all invoices for logged in user
// @route   GET /api/invoices
// @access  Private
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user_id: req.user.id }) // <-- Changed
      .populate('customer', 'name email');
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, user_id: req.user.id }) // <-- Changed
      .populate('customer', 'name email phone address')
      .populate('items.product', 'name');
      
    if (invoice) {
      res.status(200).json(invoice);
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new invoice
// @route   POST /api/invoices
// @access  Private
const createInvoice = async (req, res) => {
  const { customer, items, status, invoiceDate, dueDate } = req.body;
  
  try {
    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product with id ${item.productId} not found` });
      }
      
      const itemPrice = item.price || product.price;
      totalAmount += itemPrice * item.quantity;
      
      processedItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: itemPrice,
      });

      // Removed stock update logic as 'stock' no longer exists
    }

    const invoice = new Invoice({
      user_id: req.user.id, // <-- Changed
      customer,
      items: processedItems,
      totalAmount,
      status,
      invoiceDate,
      dueDate,
    });

    const createdInvoice = await invoice.save();
    res.status(201).json(createdInvoice);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update an invoice
// @route   PUT /api/invoices/:id
// @access  Private
const updateInvoice = async (req, res) => {
  const { status, dueDate } = req.body;
  
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, user_id: req.user.id }); // <-- Changed

    if (invoice) {
      invoice.status = status || invoice.status;
      invoice.dueDate = dueDate || invoice.dueDate;

      const updatedInvoice = await invoice.save();
      res.status(200).json(updatedInvoice);
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete an invoice
// @route   DELETE /api/invoices/:id
// @access  Private
const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, user_id: req.user.id }); // <-- Changed

    if (invoice) {
      res.status(200).json({ message: 'Invoice removed' });
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};