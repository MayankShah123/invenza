import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// Layout
import MainLayout from './components/layouts/MainLayout.jsx';

// Pages
import HomeRedirect from './pages/HomeRedirect.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Customers from './pages/Customers.jsx';
import Products from './pages/Products.jsx';
import Invoices from './pages/Invoices.jsx';
import InvoiceForm from './pages/InvoiceForm.jsx';

/**
 * A component to protect routes.
 */
function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h2 className="text-2xl">Loading...</h2>
      </div>
    );
  }

  // If we have a user, render the MainLayout which contains the page
  // If not, redirect to the /login page
  return user ? <MainLayout /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Home page redirects based on auth status */}
      <Route path="/" element={<HomeRedirect />} />

      {/* Protected Routes: All routes inside here require auth */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/products" element={<Products />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/invoices/new" element={<InvoiceForm />} />
        <Route path="/invoices/edit/:id" element={<InvoiceForm />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={
        <div className="flex justify-center items-center min-h-screen">
          <h2 className="text-4xl font-bold">404: Page Not Found</h2>
        </div>
      } />
    </Routes>
  );
}

export default App;