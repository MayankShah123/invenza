import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import Button from '@/components/ui/Button.jsx'; // Make sure this path is correct

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper for NavLink active state
  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? 'text-white bg-gray-700 px-3 py-2 rounded-md text-sm font-medium'
      : 'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium';

  return (
    <nav className="bg-gray-800 dark:bg-gray-900 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-white font-bold text-xl">My App</span>
            {/* Links */}
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <NavLink to="/dashboard" className={getNavLinkClass}>Dashboard</NavLink>
                <NavLink to="/invoices" className={getNavLinkClass}>Invoices</NavLink>
                <NavLink to="/customers" className={getNavLinkClass}>Customers</NavLink>
                <NavLink to="/products" className={getNavLinkClass}>Products</NavLink>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {/* Make sure user object is not null before accessing name */}
            {user && <span className="text-gray-300 mr-4">Welcome, {user.name}!</span>}
            <Button onClick={handleLogout} variant="secondary">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}