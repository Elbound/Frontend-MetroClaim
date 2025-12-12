import { createContext, useContext, useState } from 'react';
import { useRouter } from '@tanstack/react-router';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const login = (email) => {
    const role =
      email && email.includes('manager')
        ? 'manager'
        : email && email.includes('finance')
          ? 'finance'
          : 'employee';
    const newUser = { email, role };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    router.navigate({ to: '/login' });
  };
  const isLoggedIn = !!user;
  const isManager = user && user.role === 'manager';
  const isFinance = user && user.role === 'finance';

  const value = {
    user,
    isLoggedIn,
    isManager,
    isFinance,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
