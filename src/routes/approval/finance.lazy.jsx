import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/approval/finance')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/approval/finance"!</div>
}
