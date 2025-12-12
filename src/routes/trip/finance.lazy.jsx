import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/trip/finance')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/trip/finance"!</div>
}
