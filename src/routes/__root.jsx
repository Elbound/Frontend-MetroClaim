import { createFileRoute, createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';
import { useState } from 'react';

import SideBarComponent from '../components/SideBarComponent';
import HeaderComponent from '../components/HeaderComponent';
import { AuthProvider } from '../hooks/AuthContext';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const routerState = useRouterState();
  const currentPathName = routerState.location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showSideBar = currentPathName != '/login';

  return (
    <>
      <AuthProvider>
        <div className="flex flex-row min-h-screen w-full bg-gray-50">
          {/* Desktop Sidebar */}
          <div className={`${showSideBar ? 'hidden md:block w-auto' : 'hidden'} transition-all duration-300 ease-in-out shrink-0`}>
            <SideBarComponent />
          </div>

          {/* Mobile Sidebar Overlay */}
          {showSideBar && (
             <div className="md:hidden">
                <SideBarComponent 
                    mobileMode={true} 
                    mobileOpen={mobileMenuOpen} 
                    setMobileOpen={setMobileMenuOpen} 
                />
             </div>
          )}

          {showSideBar ? (
            <div className="flex-1 flex flex-col min-h-screen min-w-0">
               <HeaderComponent onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
               <div className="flex-1 p-6">
                  <Outlet />
               </div>
            </div>
          ) : (
            <div className="w-full min-h-screen">
               <Outlet />
            </div>
          )}
        </div>
      </AuthProvider>
    </>
  );
}
