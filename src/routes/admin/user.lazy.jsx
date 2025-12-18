import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/admin/user')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/user"!</div>
}
