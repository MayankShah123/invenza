import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { AnimatePresence, motion } from "framer-motion";

// Layout
import MainLayout from "./components/layouts/MainLayout.jsx";

// Pages
import HomeRedirect from "./pages/HomeRedirect.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Customers from "./pages/Customers.jsx";
import Products from "./pages/Products.jsx";
import Invoices from "./pages/Invoices.jsx";
import InvoiceForm from "./pages/InvoiceForm.jsx";

// --------------------
// Loading Spinner
// --------------------
function LoadingScreen() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-4"></div>
      <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
        Loading...
      </h2>
    </div>
  );
}

// --------------------
// Protected Route
// --------------------
function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  return user ? <MainLayout /> : <Navigate to="/login" replace />;
}

// --------------------
// Page Animation Wrapper
// --------------------
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Home Redirect */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/new" element={<InvoiceForm />} />
            <Route path="/invoices/edit/:id" element={<InvoiceForm />} />
          </Route>

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 text-center">
                <h1 className="text-6xl font-bold text-blue-600 mb-4">
                  404
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                  Oops! The page you’re looking for doesn’t exist.
                </p>
                <a
                  href="/dashboard"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  Go to Dashboard
                </a>
              </div>
            }
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

// --------------------
// Main App Component
// --------------------
function App() {
  return <AnimatedRoutes />;
}

export default App;
