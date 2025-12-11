import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard/test2')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
  <div className='bg-amber-300'> 
    Hello "/dashboard/test2"!
  </div>
  )
}
