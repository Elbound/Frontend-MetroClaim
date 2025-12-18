import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import MetroLogo from '../assets/metrodata-electronics--600.png';
import { useAuth } from '../hooks/AuthContext';
import { 
  LayoutDashboard, 
  Clock, 
  UserCheck, 
  Plane, 
  BadgeDollarSign, 
  PieChart, 
  Receipt, 
  FileClock, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

export default function SideBarComponent({ mobileMode = false, mobileOpen = false, setMobileOpen }) {
  const { user, isManager, isFinance, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // In mobile mode, always expanded (collapsed = false)
  const collapsed = mobileMode ? false : isCollapsed;

  // Dynamic classes
  const sidebarWidth = collapsed ? 'w-20' : 'w-64';
  const desktopClasses = `sticky top-0 h-screen shrink-0 flex flex-col ${sidebarWidth} bg-[#003366] shadow-xl text-white transition-all duration-300 ease-in-out relative z-40`;
  const mobileClasses = `fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-[#003366] shadow-2xl text-white transition-transform duration-300 ease-in-out transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`;
  
  const wrapperClass = mobileMode ? mobileClasses : desktopClasses;
  
  const linkClass = `flex items-center gap-3 p-2.5 rounded-lg text-sm mb-1 hover:bg-white/10 transition-colors duration-200 ${collapsed ? 'justify-center' : ''}`;
  const activeClass = 'bg-white/10 text-white shadow-sm';

  const handleLinkClick = () => {
      if (mobileMode && setMobileOpen) {
          setMobileOpen(false);
      }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMode && mobileOpen && (
         <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm md:hidden" 
            onClick={() => setMobileOpen(false)}
         />
      )}

      {/* Outer Wrapper */}
      <div className={wrapperClass}>
        
        {/* Mobile Close Button */}
        {mobileMode && (
             <button 
               onClick={() => setMobileOpen(false)}
               className="absolute top-4 right-4 p-1 text-white/70 hover:text-white transition-colors"
             >
               <X size={24} />
             </button>
        )}

        {/* Desktop Toggle Button */}
        {!mobileMode && (
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute -right-3 top-12 bg-blue-600 text-white p-1.5 rounded-full border border-white/20 shadow-lg hover:bg-blue-500 transition-colors z-50 transform hover:scale-110 flex items-center justify-center">
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
        )}

        {/* Inner Scrollable Area */}
        <div className="flex-1 overflow-y-auto w-full p-4 flex flex-col h-full scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent">
          {/* Header / Logo */}
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} mb-6 px-2 shrink-0 ${mobileMode ? 'mt-2' : ''}`}>
             <img src={MetroLogo} alt="Metrodata" className='w-10 h-10 min-w-10 min-h-10 rounded-full shrink-0 object-cover' />
             {!collapsed && <span className="text-lg font-bold tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300">MetroClaim</span>}
          </div>

          {/* User Profile Snippet */}
          <div className={`flex items-center gap-3 p-3 mb-6 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm shrink-0 ${collapsed ? 'justify-center' : ''}`}>
            <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full text-white font-bold text-sm shrink-0">
               {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden transition-all duration-300">
                <span className="font-semibold truncate text-sm" title={user?.name}>{user?.name || 'Guest User'}</span>
                <span className="text-xs text-blue-200 capitalize">{user?.role || 'No Role'}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col flex-1">
            <Link to="/dashboard" className={linkClass} activeProps={{ className: activeClass }} onClick={handleLinkClick}>
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Dashboard</span>}
            </Link>
            <Link to="/history" className={linkClass} activeProps={{ className: activeClass }} onClick={handleLinkClick}>
              <Clock className="w-4 h-4 shrink-0" />
              {!collapsed && <span>History</span>}
            </Link>
            
            {isManager && (
              <>
                {!collapsed && <div className="mt-4 mb-2 px-2 text-xs font-semibold text-blue-300 uppercase tracking-wider opacity-80 whitespace-nowrap">Management</div>}
                {collapsed && <div className="my-2 border-t border-white/10"></div>}
                
                <Link to="/approval/manager" className={linkClass} activeProps={{ className: activeClass }} onClick={handleLinkClick}>
                  <UserCheck className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Manager Approval</span>}
                </Link>
                <Link to="/reimbursement/manager-history" className={linkClass} activeProps={{ className: activeClass }} onClick={handleLinkClick}>
                  <Receipt className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Reimbursement History</span>}
                </Link>
                <Link to="/trip" className={linkClass} activeProps={{ className: activeClass }} onClick={handleLinkClick}>
                  <Plane className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Trip</span>}
                </Link>
              </>
            )}

            {isFinance && (
              <>
                 {!collapsed && <div className="mt-4 mb-2 px-2 text-xs font-semibold text-blue-300 uppercase tracking-wider opacity-80 whitespace-nowrap">Finance</div>}
                 {collapsed && <div className="my-2 border-t border-white/10"></div>}

                <Link to="/approval/finance" className={linkClass} activeProps={{ className: activeClass }} onClick={handleLinkClick}>
                  <BadgeDollarSign className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Finance Approval</span>}
                </Link>
                <Link to="/trip/finance" className={linkClass} activeProps={{ className: activeClass }} onClick={handleLinkClick}>
                  <PieChart className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Trip Cost Distribution</span>}
                </Link>
                <Link to="/reimbursement/finance-history" className={linkClass} activeProps={{ className: activeClass }} onClick={handleLinkClick}>
                  <Receipt className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Reimbursement History</span>}
                </Link>
                <Link to="/trip/finance-history" className={linkClass} activeProps={{ className: activeClass }} onClick={handleLinkClick}>
                  <FileClock className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Trip History</span>}
                </Link>
              </>
            )}

            <div className="mt-auto pt-4 border-t border-white/10">
              <button onClick={logout} className={`${linkClass} w-full text-left text-red-300 hover:bg-red-500/20`}>
                <LogOut className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Logout</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
