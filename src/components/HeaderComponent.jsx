import { useLocation } from '@tanstack/react-router';
import { useAuth } from '../hooks/AuthContext';
import { Menu } from 'lucide-react';

export default function HeaderComponent({ onMobileMenuToggle }) {
  const { user } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  // Simple route-to-title mapping
  const getTitle = (path) => {
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/history') return 'History';
    if (path === '/approval/manager') return 'Manager Approval';
    if (path === '/trip') return 'Trip Management';
    // if (path === '/trip/create') return 'Create Trip';
    if (path === '/approval/finance') return 'Finance Approval';
    if (path === '/trip/finance') return 'Trip Cost Distribution';
    if (path === '/reimbursement/finance-history') return 'Reimbursement History';
    if (path === '/trip/finance-history') return 'Trip History';
    if (path === '/salary') return 'Salary';
    return 'Dashboard'; // Fallback
  };

  const title = getTitle(pathname);

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between h-16 w-full bg-white border-b border-gray-200 px-4 md:px-6 shadow-sm">
      {/* Left: Hamburger + Title */}
      <div className="flex items-center">
        <button 
          onClick={onMobileMenuToggle}
          className="md:hidden mr-3 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="text-lg md:text-xl font-bold text-gray-800 tracking-tight truncated max-w-[200px] md:max-w-none">
          {title}
        </div>
      </div>

      {/* Right: User Profile (Avatar only) */}
      <div className="flex items-center gap-4">
        {/* User Initials Circle */}
        <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-[#003366] text-white rounded-full font-bold text-xs md:text-sm shadow-md cursor-pointer hover:bg-blue-800 transition-colors">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
      </div>
    </div>
  );
}
