import { createFileRoute, createRootRoute, Outlet, useRouterState } from "@tanstack/react-router";
import {ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools'
import SideBarComponent from "../SideBarComponent";
import { AuthProvider } from "../hooks/AuthContext";

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent(){
    const routerState = useRouterState();
    const currentPathName = routerState.location.pathname
    
    const showSideBar = currentPathName != "/login"

    return(
        <>
        <AuthProvider>

        <div className="flex flex-row min-w-auto min-h-screen font-sans antialiased bg-gray-800">
            { showSideBar && <SideBarComponent/>}
            <Outlet />
        </div>
        </AuthProvider>
        <TanStackRouterDevtools/>
        <ReactQueryDevtools/>
        </>
    );
}