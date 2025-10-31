import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

// A helper for status badges
const StatusBadge = ({ status }) => {
  const statusStyles = {
    Paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusStyles[status] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {status}
    </span>
  );
};

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await api.get('/invoices');
      setInvoices(res.data);
    } catch (err) {
      console.error("Failed to fetch invoices", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Link to="/invoices/new">
          <Button>Create New Invoice</Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {invoices.length === 0 ? (
             <li className="p-4 text-center text-gray-500">No invoices found.</li>
          ) : (
            invoices.map(invoice => (
              <li key={invoice._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Link to={`/invoices/edit/${invoice._id}`} className="block">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-medium text-indigo-600 dark:text-indigo-400">Invoice {invoice._id.slice(-6)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {invoice.customer?.name || 'N/A'} - {formatDate(invoice.invoiceDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">{formatCurrency(invoice.totalAmount)}</p>
                      <StatusBadge status={invoice.status} />
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default Invoices;