import { createFileRoute, Outlet } from "@tanstack/react-router";
import {ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools'

export const Route = createFileRoute({
    component: RootComponent,
})

function RootComponent(){
    return(
        <>
        <div className="flex flex-col min-w-screen min-h-screen font-sans antialiased bg-gray-50">
            <Outlet />
        </div>
        <TanStackRouterDevtools/>
        <ReactQueryDevtools/>
        </>
    );
}