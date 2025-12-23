import { useAuth } from '@/hooks/AuthContext';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/error')({
  validateSearch: (search) => ({
    status: Number(search?.status) || 500,
    msg: String(search?.msg || 'An error occurred'),
  }),
  beforeLoad: ({ context }) => {
    // if (context.auth?.isLoggingOut) return;
    if (!context.auth?.isLoggedIn) {
      throw redirect({ to: '/login' });
    }
  },
});
