import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { BarChart, Bar, PieChart, Pie, Tooltip, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { Search, UserPlus, Edit, Trash2, Eye } from "lucide-react";

const COLORS = ["#3b82f6", "#22c55e", "#f97316", "#ef4444"];

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    // mock data
    const data = [
      { id: 1, name: "Mayank Shah", email: "mayank@example.com", status: "Active", joinDate: "2024-01-10" },
      { id: 2, name: "Aisha Verma", email: "aisha@gmail.com", status: "Inactive", joinDate: "2024-02-15" },
      { id: 3, name: "Ravi Kumar", email: "ravi@gmail.com", status: "Active", joinDate: "2024-05-02" },
      { id: 4, name: "Sneha Patel", email: "sneha@gmail.com", status: "Active", joinDate: "2024-07-20" },
      { id: 5, name: "Arjun Singh", email: "arjun@gmail.com", status: "Inactive", joinDate: "2024-08-12" },
    ];
    setCustomers(data);
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const total = customers.length;
  const active = customers.filter((c) => c.status === "Active").length;
  const inactive = total - active;

  const pieData = [
    { name: "Active", value: active },
    { name: "Inactive", value: inactive },
  ];

  const barData = [
    { month: "Jan", customers: 12 },
    { month: "Feb", customers: 18 },
    { month: "Mar", customers: 25 },
    { month: "Apr", customers: 20 },
    { month: "May", customers: 28 },
    { month: "Jun", customers: 22 },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Customers Overview</h2>
        <Button className="flex gap-2"><UserPlus /> Add Customer</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Total Customers</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{total}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active Customers</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold text-green-600">{active}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Inactive Customers</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold text-red-500">{inactive}</CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Customer Segments</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Monthly New Customers</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="customers" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Customer Table */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Customer List</CardTitle>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-60"
            />
          </div>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
                <th className="p-3">Join Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <motion.tr
                  key={c.id}
                  whileHover={{ backgroundColor: "#f9fafb" }}
                  className="border-b"
                >
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3">{c.email}</td>
                  <td className={`p-3 ${c.status === "Active" ? "text-green-600" : "text-red-500"}`}>
                    {c.status}
                  </td>
                  <td className="p-3">{c.joinDate}</td>
                  <td className="p-3 flex gap-2">
                    <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
