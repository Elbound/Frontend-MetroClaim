import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/trip/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/trip/create"!</div>
}
