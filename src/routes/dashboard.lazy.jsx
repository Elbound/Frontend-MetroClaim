import { createLazyFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div 
      className="min-h-screen p-8 bg-white rounded-xl shadow-lg border-l-4 border-blue-500 transition-all duration-300 hover:shadow-xl"
    >
      <h1 className="text-3xl font-bold text-blue-700 mb-2">
        Hello "/dashboard/"!
      </h1>
      <p className="text-lg text-gray-600">
        This is the main dashboard overview content, rendered inside the sidebar layout.
      </p>
      <Outlet/>
    </div>
  )
}
