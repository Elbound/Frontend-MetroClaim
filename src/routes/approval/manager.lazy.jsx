import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/approval/manager')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/approval/manager"!</div>
}
