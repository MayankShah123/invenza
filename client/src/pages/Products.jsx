import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Package, DollarSign, Layers } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import ProductModal from "../components/modals/ProductModal";

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444"];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const avgPrice = products.length
    ? (products.reduce((sum, p) => sum + parseFloat(p.price || 0), 0) / products.length).toFixed(2)
    : 0;

  const categoryCount = Object.values(
    products.reduce((acc, p) => {
      const cat = p.category || "Uncategorized";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {})
  );

  const pieData = Object.entries(
    products.reduce((acc, p) => {
      const cat = p.category || "Uncategorized";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <Package className="text-indigo-500" /> Products
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your inventory and view analytics.
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5"
        >
          <div className="flex items-center gap-3">
            <Package className="text-indigo-500 w-6 h-6" />
            <h3 className="font-semibold text-gray-600 dark:text-gray-300">Total Products</h3>
          </div>
          <p className="text-3xl font-bold mt-2">{loading ? "..." : products.length}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5"
        >
          <div className="flex items-center gap-3">
            <DollarSign className="text-green-500 w-6 h-6" />
            <h3 className="font-semibold text-gray-600 dark:text-gray-300">Average Price</h3>
          </div>
          <p className="text-3xl font-bold mt-2">${avgPrice}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5"
        >
          <div className="flex items-center gap-3">
            <Layers className="text-pink-500 w-6 h-6" />
            <h3 className="font-semibold text-gray-600 dark:text-gray-300">Categories</h3>
          </div>
          <p className="text-3xl font-bold mt-2">{categoryCount.length}</p>
        </motion.div>
      </div>

      {/* Search bar */}
      <div className="mb-6 flex justify-between items-center">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Product Prices Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={products}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="price" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Products by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              <th className="p-3">Name</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Price</th>
              <th className="p-3">Category</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr
                key={p._id}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="p-3 font-medium text-gray-800 dark:text-gray-100">{p.name}</td>
                <td className="p-3 text-gray-600 dark:text-gray-300">{p.sku}</td>
                <td className="p-3 text-gray-800 dark:text-gray-100 font-semibold">${p.price}</td>
                <td className="p-3 text-gray-500 dark:text-gray-300">
                  {p.category || "Uncategorized"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <ProductModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Products;
