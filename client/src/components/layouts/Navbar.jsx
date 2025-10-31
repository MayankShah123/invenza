import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="w-64 bg-sidebar text-sidebar-foreground shadow-lg flex flex-col p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-wide text-primary mb-4">Invenza</h1>

      <div className="flex flex-col space-y-3">
        <Link className="hover:text-primary transition-colors" to="/dashboard">Dashboard</Link>
        <Link className="hover:text-primary transition-colors" to="/customers">Customers</Link>
        <Link className="hover:text-primary transition-colors" to="/products">Products</Link>
        <Link className="hover:text-primary transition-colors" to="/invoices">Invoices</Link>
      </div>

      <div className="mt-auto flex items-center justify-between pt-6 border-t border-border">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-2 hover:text-primary transition-colors"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          <span>{darkMode ? 'Light' : 'Dark'}</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 hover:text-destructive transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
