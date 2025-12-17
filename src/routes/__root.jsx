import { createFileRoute, createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import SideBarComponent from '../components/SideBarComponent';
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
        <div className="flex flex-row min-h-screen w-screen bg-gray-50">
          <div className={`${showSideBar ? 'w-auto' : 'w-0 hidden'} transition-all duration-300 ease-in-out shrink-0`}>
            <SideBarComponent />
          </div>

          <div className={showSideBar ? 'flex-1 overflow-x-hidden' : 'w-full'}>
            <Outlet />
          </div>
        </div>
      </AuthProvider>
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  );
}
