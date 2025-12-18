import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard/finance')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/finance"!</div>
}
