import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/history')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="">Hello "/dashboard/history"!</div>
}
