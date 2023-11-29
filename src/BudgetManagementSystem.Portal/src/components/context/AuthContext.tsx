// AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '../models/constants';

type Role = 'Owner' | 'Admin';

interface AuthContextProps {
  isAuthenticated: boolean;
  userRole: Role | null;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('isAuthenticated'))
  );
  const [userRole, setUserRole] = useState<Role | null>(
    (localStorage.getItem('userRole') as Role) || null
  ); // Ensure a null fallback if 'userRole' is not present in localStorage

  const login = (role: Role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', role); // Update this line to ensure 'role' is converted to a string
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
