import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/admin/role')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/role"!</div>
}
