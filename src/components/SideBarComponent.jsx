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
  ChevronRight
} from 'lucide-react';

export default function SideBarComponent() {
  const { user, isManager, isFinance, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Dynamic classes
  const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';
  const linkClass = `flex items-center gap-3 p-2.5 rounded-lg text-sm mb-1 hover:bg-white/10 transition-colors duration-200 ${isCollapsed ? 'justify-center' : ''}`;
  const activeClass = 'bg-white/10 text-white shadow-sm';

  return (
    <>
      {/* Outer Wrapper: Handles Width, Position, Background, Transition */}
      <div className={`sticky top-0 h-screen shrink-0 flex flex-col ${sidebarWidth} bg-[#003366] shadow-xl text-white transition-all duration-300 ease-in-out relative z-40`}>
        
        {/* Toggle Button: Absolutely positioned relative to Outer Wrapper, OUTSIDE the scrollable area */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-12 bg-blue-600 text-white p-1.5 rounded-full border border-white/20 shadow-lg hover:bg-blue-500 transition-colors z-50 transform hover:scale-110 flex items-center justify-center">
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Inner Scrollable Area */}
        <div className="flex-1 overflow-y-auto w-full p-4 flex flex-col h-full scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent">
          {/* Header / Logo */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} mb-6 px-2 shrink-0`}>
             <img src={MetroLogo} alt="Metrodata" className='w-10 h-10 min-w-10 min-h-10 rounded-full shrink-0 object-cover' />
             {!isCollapsed && <span className="text-lg font-bold tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300">MetroClaim</span>}
          </div>

          {/* User Profile Snippet */}
          <div className={`flex items-center gap-3 p-3 mb-6 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm shrink-0 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full text-white font-bold text-sm shrink-0">
               {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden transition-all duration-300">
                <span className="font-semibold truncate text-sm" title={user?.name}>{user?.name || 'Guest User'}</span>
                <span className="text-xs text-blue-200 capitalize">{user?.role || 'No Role'}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col flex-1">
            <Link to="/dashboard" className={linkClass} activeProps={{ className: activeClass }}>
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
            <Link to="/history" className={linkClass} activeProps={{ className: activeClass }}>
              <Clock className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>History</span>}
            </Link>
            
            {isManager && (
              <>
                {!isCollapsed && <div className="mt-4 mb-2 px-2 text-xs font-semibold text-blue-300 uppercase tracking-wider opacity-80 whitespace-nowrap">Management</div>}
                {isCollapsed && <div className="my-2 border-t border-white/10"></div>}
                
                <Link to="/approval/manager" className={linkClass} activeProps={{ className: activeClass }}>
                  <UserCheck className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Manager Approval</span>}
                </Link>
                <Link to="/trip" className={linkClass} activeProps={{ className: activeClass }}>
                  <Plane className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Trip</span>}
                </Link>
              </>
            )}

            {isFinance && (
              <>
                 {!isCollapsed && <div className="mt-4 mb-2 px-2 text-xs font-semibold text-blue-300 uppercase tracking-wider opacity-80 whitespace-nowrap">Finance</div>}
                 {isCollapsed && <div className="my-2 border-t border-white/10"></div>}

                <Link to="/approval/finance" className={linkClass} activeProps={{ className: activeClass }}>
                  <BadgeDollarSign className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Finance Approval</span>}
                </Link>
                <Link to="/trip/finance" className={linkClass} activeProps={{ className: activeClass }}>
                  <PieChart className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Trip Cost Distribution</span>}
                </Link>
                <Link to="/reimbursement/finance-history" className={linkClass} activeProps={{ className: activeClass }}>
                  <Receipt className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Reimbursement History</span>}
                </Link>
                <Link to="/trip/finance-history" className={linkClass} activeProps={{ className: activeClass }}>
                  <FileClock className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Trip History</span>}
                </Link>
              </>
            )}

            <div className="mt-auto pt-4 border-t border-white/10">
              <button onClick={logout} className={`${linkClass} w-full text-left text-red-300 hover:bg-red-500/20`}>
                <LogOut className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>Logout</span>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
