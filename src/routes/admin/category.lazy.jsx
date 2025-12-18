import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/admin/category')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/category"!</div>
}
