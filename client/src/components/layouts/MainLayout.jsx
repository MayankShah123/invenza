import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx'; // We'll create this next

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 container mx-auto p-4 md:p-6">
        {/* This renders the specific page component (e.g., Dashboard) */}
        <Outlet /> 
      </div>
    </div>
  );
};

export default MainLayout;