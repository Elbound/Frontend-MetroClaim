import { createContext, useContext, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Extracted function for clean reuse during login and hydration
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
        console.error("Failed to decode token:", error);
        return null; 
    }
};

export function AuthProvider({ children }) {
    const router = useRouter();

    // NEW: Function to read state from localStorage for initial hydration
    const getInitialUser = () => {
        const token = localStorage.getItem('authToken');
        return decodeAndStructureUser(token);
    };
    
    // CHANGED: useState now initializes with the token/user from localStorage
    const [user, setUser] = useState(getInitialUser); 

    const login = (token) => {
        const userTK = decodeAndStructureUser(token);
        
        // if(userTK.role!='Employee'){
        //   userTK.role = [...userTK.role, ' Employee']
        // }

        if (userTK) {
            // ADDED: Save token to persistence layer (localStorage)
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(userTK));

            setUser(userTK);
        } else {
            console.error("Login failed: Token could not be decoded.");
            // Optionally call logout here
        }
    };

    const logout = () => {
        // ADDED: Clear persistence layer
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
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