import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <main className="flex-1 p-6 md:p-8 animate-fade-in overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
