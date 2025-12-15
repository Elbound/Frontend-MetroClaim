import { createContext, useContext, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import postLogin from '@/api/postLogin';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const login = async (email, password) => {
    const response = await postLogin(email, password);
    const token = response.data.token;

    const raw = jwtDecode(token);

    const userTK = {
      id: raw['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      name: raw['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      email: raw['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      role: raw['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
      exp: raw.exp,
    };

    setUser(userTK);
  };

  const logout = () => {
    setUser(null);
    router.navigate({ to: '/login' });
  };

  const isLoggedIn = !!user;
  const isManager = user?.role.includes('Manager');
  const isFinance = user?.role.includes('Finance');

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
