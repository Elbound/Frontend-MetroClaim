import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState (null);

  const detectRole = (email) => {
    return email && email.includes('man') ? 'manager' : 'employee';
  };

  const login = (email) => {
    const role = detectRole(email);
    setUser({ email, role, isLoggedIn: true });
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    isLoggedIn: !!user,
    isManager: user && user.role === 'manager',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
