import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { router } from '../router';
import { useAuth } from '../hooks/AuthContext';
import postLogin from '@/api/postLogin';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import MetroLogo from '../assets/metrodata-electronics--600.png';

export const Route = createLazyFileRoute('/login')({
  component: RouteComponent,
});

function RouteComponent() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await postLogin(email, password);
      setIsLoading(false);
      const token = response.data.token;

      login(token);
      router.navigate({ to: '/dashboard' });
    } catch (msg) {
      setIsLoading(false);
      console.log(msg);
      setError('Account doesnt exist / Incorrect input');
    }
  };

  return (
    <div className="min-h-full w-full flex items-center justify-center bg-[#003366] p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center mb-8">
          <img
            alt="MetroClaim"
            src={MetroLogo}
            className="h-16 w-16 mb-4 rounded-full object-cover"
          />
          <h2 className="text-center text-3xl font-bold tracking-tight text-[#003366]">
            MetroClaim
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Sign in to manage your reimbursements
          </p>
        </div>

        <form onSubmit={handleSubmit} method="POST" className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all duration-200 sm:text-sm"
            />
          </div>

<<<<<<< HEAD
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="text-sm">
              <a
                href="#"
                className="font-semibold text-[#003366] hover:text-blue-800 transition-colors"
              >
                Forgot password?
              </a>
=======
          <div>
            <div className="mb-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
>>>>>>> a3ad1442377e1e78577362011a349c3f68e2a74d
            </div>
          </div>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 pr-11 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all duration-200 sm:text-sm"
            />
<<<<<<< HEAD

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-[#003366] transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
=======
            <div className="text-xs text-right mt-2">
              <a href="#" className="font-semibold text-[#003366] hover:text-blue-800 transition-colors">
                Forgot password?
              </a>
            </div>
>>>>>>> a3ad1442377e1e78577362011a349c3f68e2a74d
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded-lg bg-[#003366] px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003366] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 items-center gap-2 transform active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-500">
          Don't have an account? Contact Admin at{' '}
          <a
            href="mailto:admin@mii.co.id"
            className="font-semibold text-[#003366] hover:text-blue-800 transition-colors"
          >
            admin@mii.co.id
          </a>
        </p>
      </div>
    </div>
  );
}
