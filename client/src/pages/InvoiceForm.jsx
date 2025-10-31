import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Trash2, FileText, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from "@/components/ui/input";
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

function InvoiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1, price: 0 }]);
  const [status, setStatus] = useState('Pending');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customerRes, productRes] = await Promise.all([
          api.get('/customers'),
          api.get('/products'),
        ]);
        setCustomers(customerRes.data);
        setProducts(productRes.data);

        if (isEditing) {
          const invoiceRes = await api.get(`/invoices/${id}`);
          const invoice = invoiceRes.data;
          setSelectedCustomer(invoice.customer._id);
          setStatus(invoice.status);
          setItems(
            invoice.items.map(item => ({
              productId: item.product._id,
              quantity: item.quantity,
              price: item.price,
            }))
          );
        }
      } catch (err) {
        console.error('Failed to load invoice form data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEditing]);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    if (field === 'productId') {
      const product = products.find(p => p._id === value);
      updated[index].price = product ? product.price : 0;
    }
    setItems(updated);
  };

  const addItem = () => setItems([...items, { productId: '', quantity: 1, price: 0 }]);
  const removeItem = index => setItems(items.filter((_, i) => i !== index));

  const calculateTotal = () =>
    items.reduce((total, item) => total + item.quantity * item.price, 0);

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    const invoiceData = {
      customer: selectedCustomer,
      items: items.map(item => ({ ...item, productId: item.productId })),
      status,
      totalAmount: calculateTotal(),
    };

    try {
      if (isEditing) {
        await api.put(`/invoices/${id}`, { status });
      } else {
        await api.post('/invoices', invoiceData);
      }
      navigate('/invoices');
    } catch (err) {
      console.error('Failed to save invoice', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-600 dark:text-gray-300">
        <Loader2 className="animate-spin mr-2" /> Loading invoice form...
      </div>
    );

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="text-indigo-600" size={30} />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {isEditing ? 'Edit Invoice' : 'Create New Invoice'}
          </h1>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/invoices')}
          className="text-sm"
        >
          Back
        </Button>
      </div>

      {/* Customer & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Customer
          </label>
          <select
            value={selectedCustomer}
            onChange={e => setSelectedCustomer(e.target.value)}
            disabled={isEditing}
            className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="" disabled>
              Select a customer
            </option>
            {customers.map(c => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option>Pending</option>
            <option>Paid</option>
            <option>Overdue</option>
          </select>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Items</h2>
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-12 gap-4 mb-3 items-center"
          >
            <div className="col-span-5">
              <select
                value={item.productId}
                onChange={e => handleItemChange(index, 'productId', e.target.value)}
                disabled={isEditing}
                className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="" disabled>
                  Select product
                </option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                disabled={isEditing}
                required
              />
            </div>
            <div className="col-span-2">
              <Input
                type="number"
                step="0.01"
                min="0"
                value={item.price}
                onChange={e => handleItemChange(index, 'price', e.target.value)}
                disabled={isEditing}
                required
              />
            </div>
            <div className="col-span-2 text-right text-gray-800 dark:text-gray-200 font-semibold">
              {formatCurrency(item.quantity * item.price)}
            </div>
            <div className="col-span-1 text-center">
              {!isEditing && items.length > 1 && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => removeItem(index)}
                  className="p-2"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          </motion.div>
        ))}
        {!isEditing && (
          <Button
            type="button"
            onClick={addItem}
            variant="secondary"
            className="mt-3 flex items-center gap-2"
          >
            <Plus size={16} /> Add Item
          </Button>
        )}
      </div>

      {/* Total and Save */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex justify-between items-center">
        <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Total: <span className="text-2xl ml-2 text-indigo-600">{formatCurrency(calculateTotal())}</span>
        </div>
        <Button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Saving...
            </>
          ) : (
            isEditing ? 'Save Changes' : 'Create Invoice'
          )}
        </Button>
      </div>
    </motion.form>
  );
}

export default InvoiceForm;
