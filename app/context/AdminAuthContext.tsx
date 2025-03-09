'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AdminAuthContextType = {
  isAdminAuthenticated: boolean;
  adminLogin: (username: string, password: string) => boolean;
  adminLogout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if admin is already authenticated on mount
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const adminLogin = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'admin') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('adminAuth');
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminAuthenticated, adminLogin, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
} 