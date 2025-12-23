import { useLocation, Link } from '@tanstack/react-router';
import { useAuth } from '../hooks/AuthContext';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function HeaderComponent({ onMobileMenuToggle }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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
    if (path === '/admin/user') return 'User Management';
    if (path === '/admin/role') return 'Role Management';
    if (path === '/admin/category') return 'Category Management';
    if (path === '/user') return 'My Profile';
    return 'Dashboard'; // Fallback
  };

  const title = getTitle(pathname);

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

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

      {/* Right: User Profile Dropdown */}
      <div className="relative" ref={menuRef}>
        <div 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-[#003366] text-white rounded-full font-bold text-xs md:text-sm shadow-md cursor-pointer hover:bg-blue-800 transition-colors"
        >
          {getInitials(user?.name)}
        </div>

        {/* Dropdown Menu */}
        {isMenuOpen && (
             <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 z-50 text-gray-800 ring-1 ring-black/5">
                {/* Header: Close Button */}
                <div className="p-4 flex justify-end">
                    <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-full p-1">
                        <X size={20} />
                    </button>
                </div>

                {/* Body: Avatar + Query + Email */}
                <div className="flex flex-col items-center pb-8 px-6">
                     <div className="relative mb-4">
                         <div className="w-20 h-20 bg-[#003366] text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg ring-4 ring-white">
                             {getInitials(user?.name)}
                         </div>
                         <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border border-gray-100 shadow-sm">
                             <User size={14} className="text-[#003366]" />
                         </div>
                     </div>
                     
                     <h3 className="text-xl font-semibold text-gray-900 mb-1 text-center">Hi, {user?.name}!</h3>
                     <p className="text-sm text-gray-500 mb-6 text-center">{user?.email}</p>
                     
                     <Link 
                        to="/user" 
                        onClick={() => setIsMenuOpen(false)}
                        className="px-6 py-2 rounded-full border border-gray-300 text-sm font-medium text-[#003366] hover:bg-blue-50 hover:border-blue-200 transition-all active:scale-95"
                     >
                        See your Profile
                     </Link>
                </div>

                {/* Footer: Sign Out */}
                <div className="bg-gray-50 p-0 border-t border-gray-100"> 
                    <div className="flex justify-center p-4">
                        <button 
                            onClick={logout}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all"
                        >
                            <LogOut size={16} />
                            Sign out
                        </button>
                    </div>
                    
                    <div className="bg-gray-100 p-3 text-center text-[10px] text-gray-400 border-t border-gray-200">
                        
                    </div>
                </div>
             </div>
        )}
      </div>
    </div>
  );
}
