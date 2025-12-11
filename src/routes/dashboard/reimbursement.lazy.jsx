import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard/reimbursement')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/reimbursementForm"!</div>
}
