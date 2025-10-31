import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

function InvoiceForm() {
  const { id } = useParams(); // Check if we are editing
  const navigate = useNavigate();
  const isEditing = !!id;

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1, price: 0 }]);
  const [status, setStatus] = useState('Pending');
  const [loading, setLoading] = useState(true);

  // Fetch initial data (customers, products, and existing invoice if editing)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch customers and products in parallel
        const [customerRes, productRes] = await Promise.all([
          api.get('/customers'),
          api.get('/products')
        ]);
        setCustomers(customerRes.data);
        setProducts(productRes.data);

        if (isEditing) {
          // If editing, fetch the specific invoice
          const invoiceRes = await api.get(`/invoices/${id}`);
          const invoice = invoiceRes.data;
          setSelectedCustomer(invoice.customer._id);
          setStatus(invoice.status);
          // Format items for the form
          setItems(invoice.items.map(item => ({
            productId: item.product._id,
            quantity: item.quantity,
            price: item.price,
          })));
        }
      } catch (err) {
        console.error("Failed to load invoice form data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEditing]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    // If product changes, update the price
    if (field === 'productId') {
      const product = products.find(p => p._id === value);
      newItems[index].price = product ? product.price : 0;
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const invoiceData = {
      customer: selectedCustomer,
      items: items.map(item => ({ ...item, productId: item.productId })), // Ensure correct format
      status,
      // totalAmount is calculated on the backend, but we can send it
      totalAmount: calculateTotal(),
    };

    try {
      if (isEditing) {
        // We are only allowing status updates for simplicity, as per backend controller
        await api.put(`/invoices/${id}`, { status });
      } else {
        await api.post('/invoices', invoiceData);
      }
      navigate('/invoices');
    } catch (err) {
      console.error("Failed to save invoice", err);
    }
  };
  
  if (loading) return <div>Loading form...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-3xl font-bold">{isEditing ? `Edit Invoice ${id.slice(-6)}` : 'Create New Invoice'}</h1>
      
      {/* Customer & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div>
          <label htmlFor="customer" className="block text-sm font-medium mb-1">Customer</label>
          <select
            id="customer"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
            required
            disabled={isEditing} // Don't allow changing customer on an existing invoice
          >
            <option value="" disabled>Select a customer</option>
            {customers.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
          >
            <option>Pending</option>
            <option>Paid</option>
            <option>Overdue</option>
          </select>
        </div>
      </div>

      {/* Line Items */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Items</h2>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-5">
                <select
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                  required
                  disabled={isEditing}
                >
                  <option value="" disabled>Select a product</option>
                  {products.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  required
                  disabled={isEditing}
                />
              </div>
              <div className="col-span-2">
                 <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                  required
                  disabled={isEditing} // Price is set from product
                />
              </div>
              <div className="col-span-2 text-right">
                <span className="font-medium">{formatCurrency(item.quantity * item.price)}</span>
              </div>
              <div className="col-span-1">
                {items.length > 1 && !isEditing && (
                  <Button type="button" variant="danger" onClick={() => removeItem(index)} className="px-2 py-1">
                    X
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        {!isEditing && (
          <Button type="button" variant="secondary" onClick={addItem} className="mt-4">
            + Add Item
          </Button>
        )}
      </div>

      {/* Total & Save */}
      <div className="flex justify-between items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div>
          <span className="text-lg">Total:</span>
          <span className="text-2xl font-bold ml-2">{formatCurrency(calculateTotal())}</span>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/invoices')}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Save Changes' : 'Create Invoice'}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default InvoiceForm;