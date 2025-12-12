import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/history')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="min-w-screen">Hello "/dashboard/history"!</div>
}
