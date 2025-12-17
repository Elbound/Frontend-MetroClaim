import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/error')({
  component: RouteComponent,

})

function RouteComponent() {
  const {status, msg} = Route.useSearch();

  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <div className="rounded-lg bg-red-50 p-8 shadow-sm border border-red-100">
        <h1 className="text-6xl font-black text-red-600 mb-2">
          {status || '500'}
        </h1>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-600 mb-6">
          {msg || "An unexpected error occurred."}
        </p>
        
        <button
          onClick={() => reset()}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
