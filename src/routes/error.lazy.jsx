import { createLazyFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react' // Optional: if you use lucide-icons

export const Route = createLazyFileRoute('/error')({
  component: RouteComponent,
})

function RouteComponent() {
  const { status, msg } = Route.useSearch()
  const navigate = useNavigate()
  const router = useRouter()

  // This handles the "Try Again" logic manually
  const handleRetry = () => {
    // router.history.back() tries to go back and re-trigger the previous fetch
    router.history.back()
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full rounded-xl bg-white p-10 shadow-xl border border-gray-100">
        {/* Visual Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertCircle size={32} />
        </div>

        <h1 className="text-7xl font-black text-gray-900 mb-2 tracking-tight">
          {status || '500'}
        </h1>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          System Error
        </h2>
        
        <p className="text-gray-500 mb-8 leading-relaxed">
          {msg || "We encountered an unexpected issue while loading your data."}
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={handleRetry}
            className="flex items-center justify-center gap-2 w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
          
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className="flex items-center justify-center gap-2 w-full rounded-lg bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
          >
            <ArrowLeft size={18} />
            Return to Dashboard
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-xs text-gray-400 uppercase tracking-widest font-medium">
        Error Reference: {new Date().getTime().toString(36).toUpperCase()}
      </p>
    </div>
  )
}