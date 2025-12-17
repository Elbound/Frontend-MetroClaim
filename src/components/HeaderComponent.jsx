import { useLocation } from '@tanstack/react-router';
import { useAuth } from '../hooks/AuthContext';

export default function HeaderComponent() {
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
    return 'Dashboard'; // Fallback
  };

  const title = getTitle(pathname);

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between h-16 w-full bg-white border-b border-gray-200 px-6 shadow-sm">
      {/* Left: Dynamic Title */}
      <div className="text-xl font-bold text-gray-800 tracking-tight">
        {title}
      </div>

      {/* Right: User Profile (Avatar only) */}
      <div className="flex items-center gap-4">
        {/* User Initials Circle */}
        <div className="flex items-center justify-center w-10 h-10 bg-[#003366] text-white rounded-full font-bold text-sm shadow-md cursor-pointer hover:bg-blue-800 transition-colors">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
      </div>
    </div>
  );
}
