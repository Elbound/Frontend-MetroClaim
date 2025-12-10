import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/')({
    component: RootComponent,
})

function RootComponent(){
    return(
        <div className="flex flex-col min-h-screen font-sans antialiased bg-gray-50">
            <Outlet />
        </div>
    );
}