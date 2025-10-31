import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ invoices: 0, customers: 0, products: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This is a good way to fetch multiple endpoints
    const fetchStats = async () => {
      try {
        const [invoiceRes, customerRes, productRes] = await Promise.all([
          api.get('/invoices'),
          api.get('/customers'),
          api.get('/products'),
        ]);
        setStats({
          invoices: invoiceRes.data.length,
          customers: customerRes.data.length,
          products: productRes.data.length,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-2xl">Welcome, {user.name}!</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Here's a summary of your business.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium">Total Invoices</h3>
          <p className="text-3xl font-bold mt-2">
            {loading ? '...' : stats.invoices}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium">Total Customers</h3>
          <p className="text-3xl font-bold mt-2">
            {loading ? '...' : stats.customers}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium">Total Products</h3>
          <p className="text-3xl font-bold mt-2">
            {loading ? '...' : stats.products}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;