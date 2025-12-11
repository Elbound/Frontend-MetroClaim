import { createFileRoute, createRootRoute, Outlet, useRouterState } from "@tanstack/react-router";
import {ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools'
import SideBarComponent from "../SideBarComponent";

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent(){
    const routerState = useRouterState();
    const currentPathName = routerState.location.pathname
    
    const showSideBar = currentPathName != "/login"

    return(
        <>
        <div className="flex flex-row min-w-auto min-h-screen font-sans antialiased bg-gray-50">
            { showSideBar && <SideBarComponent/>}
            <Outlet />
        </div>
        <TanStackRouterDevtools/>
        <ReactQueryDevtools/>
        </>
    );
}