import { createContext, useContext, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const decodeAndStructureUser = (token) => {
  if (!token) return null;

  try {
    const raw = jwtDecode(token);

    return {
      id: raw['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      name: raw['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      email: raw['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      role: raw['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
      tk: token,
    };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export function AuthProvider({ children }) {
  const router = useRouter();

  const getInitialUser = () => {
    const token = localStorage.getItem('authToken');
    return decodeAndStructureUser(token);
  };

  const [user, setUser] = useState(getInitialUser);

  const login = (token) => {
    const userTK = decodeAndStructureUser(token);

    // if(userTK.role!='Employee'){
    //   userTK.role = [...userTK.role, ' Employee']
    // }

    if (userTK) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userTK));

      setUser(userTK);
    } else {
      console.error('Login failed: Token could not be decoded.');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    setUser(null);
    router.navigate({ to: '/login' });
  };

  const isLoggedIn = !!user;
  const isManager = user?.role.includes('Manager');
  const isFinance = user?.role.includes('Finance');
  const isAdmin = user?.role.includes('Admin');

  const value = {
    user,
    isLoggedIn,
    isManager,
    isFinance,
    isAdmin,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
