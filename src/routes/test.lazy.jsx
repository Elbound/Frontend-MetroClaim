import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div 
      className="flex flex-col items-center justify-center p-12 bg-purple-100 min-h-[50vh] flex-grow shadow-lg rounded-xl"
    >
      <h1 className="text-4xl font-extrabold text-purple-700">
        Hello "/test"!
      </h1>
      <p className="mt-2 text-lg text-purple-500">
        This is a new test route content.
      </p>
    </div>
  )
}
