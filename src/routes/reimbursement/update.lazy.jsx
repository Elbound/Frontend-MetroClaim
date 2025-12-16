import { createLazyFileRoute } from "@tanstack/react-router";


export const Route = createLazyFileRoute('/reimbursement/update')({
  component: RouteComponent,
});

function RouteComponent() {
    return (<div>Jeeee</div>)
}

