import { createFileRoute, createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';

import SideBarComponent from '../components/SideBarComponent';
import HeaderComponent from '../components/HeaderComponent';
import { AuthProvider } from '../hooks/AuthContext';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const routerState = useRouterState();
  const currentPathName = routerState.location.pathname;

  const showSideBar = currentPathName != '/login';

  return (
    <>
      <AuthProvider>
        <div className="flex flex-row min-h-screen w-full bg-gray-50 overflow-hidden">
          <div className={`${showSideBar ? 'w-auto' : 'w-0 hidden'} transition-all duration-300 ease-in-out shrink-0`}>
            <SideBarComponent />
          </div>

          {showSideBar ? (
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
               <HeaderComponent />
               <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300">
                  <Outlet />
               </div>
            </div>
          ) : (
            <div className="w-full h-screen overflow-auto">
               <Outlet />
            </div>
          )}
        </div>
      </AuthProvider>
    </>
  );
}
