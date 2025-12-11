import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/reimbursement')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="min-w-screen">Hello "/dashboard/reimbursementForm"!</div>
}
