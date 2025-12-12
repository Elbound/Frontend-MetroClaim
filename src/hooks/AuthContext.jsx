import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email) => {
    const role = email && email.includes('man') ? 'manager' : 'employee';
    const newUser = { email, role };
    setUser(newUser);

  };

  const logout = () => {
    setUser(null);

  };

  const isLoggedIn = !!user;
  const isManager = user && user.role === 'manager';

  const value = {
    user,
    isLoggedIn,
    isManager,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
