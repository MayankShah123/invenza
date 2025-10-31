import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  PlusCircle,
  Download,
  Mail,
  Filter,
  FileDown,
  ArrowUpDown,
} from "lucide-react";
import jsPDF from "jspdf";

// Dummy data
const dummyInvoices = [
  { id: "INV001", customer: "John Doe", date: "2025-10-25", amount: 1200, status: "Paid" },
  { id: "INV002", customer: "Jane Smith", date: "2025-10-27", amount: 800, status: "Pending" },
  { id: "INV003", customer: "Sam Wilson", date: "2025-10-30", amount: 400, status: "Overdue" },
  { id: "INV004", customer: "Lisa Ray", date: "2025-10-29", amount: 900, status: "Paid" },
];

const Invoices = () => {
  const [invoices, setInvoices] = useState(dummyInvoices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date"); // new
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    customer: "",
    amount: "",
    status: "Pending",
  });

  // 🔍 Filtering + Sorting Logic
  const filteredInvoices = useMemo(() => {
    let filtered = invoices.filter((inv) => {
      const matchesSearch =
        inv.customer.toLowerCase().includes(search.toLowerCase()) ||
        inv.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    if (sortBy === "date") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "amount") {
      filtered.sort((a, b) => b.amount - a.amount);
    }
    return filtered;
  }, [invoices, search, statusFilter, sortBy]);

  // 📄 Single Invoice PDF
  const downloadPDF = (invoice) => {
    const doc = new jsPDF();
    doc.text(`Invoice ID: ${invoice.id}`, 10, 10);
    doc.text(`Customer: ${invoice.customer}`, 10, 20);
    doc.text(`Date: ${invoice.date}`, 10, 30);
    doc.text(`Amount: $${invoice.amount}`, 10, 40);
    doc.text(`Status: ${invoice.status}`, 10, 50);
    doc.save(`invoice-${invoice.id}.pdf`);
  };

  // 📦 Export All as CSV
  const exportCSV = () => {
    const headers = ["Invoice ID,Customer,Date,Amount,Status"];
    const rows = invoices.map(
      (i) => `${i.id},${i.customer},${i.date},${i.amount},${i.status}`
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "invoices.csv";
    link.click();
  };

  // 📊 Totals
  const totalPaid = invoices.filter((i) => i.status === "Paid").reduce((a, i) => a + i.amount, 0);
  const totalPending = invoices.filter((i) => i.status === "Pending").reduce((a, i) => a + i.amount, 0);
  const totalOverdue = invoices.filter((i) => i.status === "Overdue").reduce((a, i) => a + i.amount, 0);

  // 📈 Chart
  const chartData = useMemo(() => {
    const grouped = {};
    filteredInvoices.forEach((inv) => {
      const month = inv.date.slice(0, 7);
      grouped[month] = (grouped[month] || 0) + inv.amount;
    });
    return Object.keys(grouped).map((month) => ({ month, revenue: grouped[month] }));
  }, [filteredInvoices]);

  // ➕ Add Invoice
  const handleAddInvoice = () => {
    if (!newInvoice.customer || !newInvoice.amount) return;
    const newId = `INV${String(invoices.length + 1).padStart(3, "0")}`;
    setInvoices([
      ...invoices,
      {
        id: newId,
        customer: newInvoice.customer,
        amount: parseFloat(newInvoice.amount),
        status: newInvoice.status,
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
    setIsModalOpen(false);
    setNewInvoice({ customer: "", amount: "", status: "Pending" });
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">📄 Invoices</h1>
          <p className="text-sm text-muted-foreground">Manage, track & export your billing data efficiently.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={exportCSV}>
            <FileDown className="h-4 w-4 mr-2" /> Export CSV
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardHeader><CardTitle>Total Invoices</CardTitle></CardHeader><CardContent>{invoices.length}</CardContent></Card>
        <Card><CardHeader><CardTitle>Paid</CardTitle></CardHeader><CardContent>${totalPaid}</CardContent></Card>
        <Card><CardHeader><CardTitle>Pending</CardTitle></CardHeader><CardContent>${totalPending}</CardContent></Card>
        <Card><CardHeader><CardTitle>Overdue</CardTitle></CardHeader><CardContent>${totalOverdue}</CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center mt-4">
        <Filter className="text-muted-foreground" />
        <Input
          placeholder="Search by name or invoice ID..."
          className="w-[250px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select onValueChange={setStatusFilter} defaultValue="all">
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort by dropdown */}
        <Select onValueChange={setSortBy} defaultValue="date">
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="amount">Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center text-muted-foreground py-8 animate-pulse">
              No invoices found.
            </div>
          ) : (
            <table className="w-full mt-4 text-sm border-collapse">
              <thead>
                <tr className="text-left border-b bg-muted/30">
                  <th className="p-2">Invoice ID</th>
                  <th className="p-2">Customer</th>
                  <th className="p-2 flex items-center gap-1">
                    Date <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                  </th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Status</th>
                  <th className="p-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-muted/30 transition">
                    <td className="p-2 font-medium">{invoice.id}</td>
                    <td className="p-2">{invoice.customer}</td>
                    <td className="p-2">{invoice.date}</td>
                    <td className="p-2">${invoice.amount}</td>
                    <td className="p-2">
                      <Badge
                        variant={
                          invoice.status === "Paid"
                            ? "success"
                            : invoice.status === "Pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="p-2 flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => downloadPDF(invoice)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader><CardTitle>Monthly Revenue Trend</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create New Invoice</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Customer Name"
              value={newInvoice.customer}
              onChange={(e) => setNewInvoice({ ...newInvoice, customer: e.target.value })}
            />
            <Input
              placeholder="Amount"
              type="number"
              value={newInvoice.amount}
              onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
            />
            <Select
              onValueChange={(v) => setNewInvoice({ ...newInvoice, status: v })}
              defaultValue={newInvoice.status}
            >
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full" onClick={handleAddInvoice}>
              Save Invoice
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Invoices;
