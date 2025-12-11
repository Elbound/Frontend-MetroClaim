import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/trip')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="min-w-screen">Hello "/trip create trip"!</div>
}
