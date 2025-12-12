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
          <div className={showSideBar ? 'w-[15%]' : 'w-0 hidden'}>
            <SideBarComponent />
          </div>

          <div className={showSideBar ? 'w-[85%]' : 'w-full'}>
            <Outlet />
          </div>
        </div>
      </AuthProvider>
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  );
}
