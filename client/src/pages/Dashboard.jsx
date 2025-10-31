import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { FileText, Users, Package, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ invoices: 0, customers: 0, products: 0 });
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [invoiceRes, customerRes, productRes] = await Promise.all([
          api.get("/invoices"),
          api.get("/customers"),
          api.get("/products"),
        ]);

        setStats({
          invoices: invoiceRes.data.length,
          customers: customerRes.data.length,
          products: productRes.data.length,
        });

        setInvoices(invoiceRes.data.slice(-5)); // show last 5 invoices
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Fake chart data (replace with your analytics API later)
  const revenueData = [
    { month: "Jan", revenue: 2400 },
    { month: "Feb", revenue: 3200 },
    { month: "Mar", revenue: 1800 },
    { month: "Apr", revenue: 4200 },
    { month: "May", revenue: 3900 },
    { month: "Jun", revenue: 4700 },
  ];

  const productData = [
    { name: "Electronics", value: 40 },
    { name: "Clothing", value: 25 },
    { name: "Grocery", value: 20 },
    { name: "Other", value: 15 },
  ];

  const COLORS = ["#3b82f6", "#22c55e", "#f97316", "#a855f7"];

  const cards = [
    { title: "Total Invoices", value: stats.invoices, icon: FileText, color: "from-blue-500 to-indigo-500" },
    { title: "Total Customers", value: stats.customers, icon: Users, color: "from-emerald-500 to-green-500" },
    { title: "Total Products", value: stats.products, icon: Package, color: "from-pink-500 to-rose-500" },
    { title: "Revenue (₹)", value: "92,450", icon: DollarSign, color: "from-yellow-400 to-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2">
          Welcome, {user?.name ? user.name.split(" ")[0] : "User"} 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Here's a detailed look at your business performance and activity.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
            className={`relative overflow-hidden bg-gradient-to-r ${card.color} text-white p-6 rounded-2xl shadow-lg flex items-center justify-between`}
          >
            <div>
              <h3 className="text-lg font-medium opacity-90">{card.title}</h3>
              <p className="text-3xl font-bold mt-2">{loading ? "..." : card.value}</p>
            </div>
            <card.icon className="w-10 h-10 opacity-80" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-3xl"></div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Revenue Line Chart */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Revenue Growth</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Product Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Product Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={productData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value">
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bar Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Monthly Invoice Count</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Activity Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Recent Invoices</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
              <thead className="border-b dark:border-gray-700">
                <tr>
                  <th className="py-2 px-3">Customer</th>
                  <th className="py-2 px-3">Amount</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length > 0 ? (
                  invoices.map((inv, i) => (
                    <tr key={i} className="border-b dark:border-gray-700">
                      <td className="py-2 px-3">{inv.customerName || "N/A"}</td>
                      <td className="py-2 px-3">₹{inv.amount || "0"}</td>
                      <td className="py-2 px-3">
                        {new Date(inv.date || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            inv.status === "Paid"
                              ? "bg-green-200 text-green-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {inv.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-3 text-center" colSpan="4">
                      No recent invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
