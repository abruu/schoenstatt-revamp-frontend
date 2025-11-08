'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, StrapiUser } from '@/lib/services/auth-service';

interface AuthContextType {
  user: StrapiUser | null;
  loading: boolean;
  signingOut: boolean;
  login: (identifier: string, password: string) => Promise<{ error?: string; success?: boolean }>;
  logout: () => void;
  isSuperAdmin: boolean;
  centerName: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function StrapiAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StrapiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = authService.getToken();
    if (token) {
      authService.getProfile()
        .then(setUser)
        .catch((error) => {
          console.error('Error fetching profile:', error);
          authService.logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      const { user: loggedInUser } = await authService.login({ identifier, password });
      
      // Fetch full profile with center details
      const profile = await authService.getProfile();
      setUser(profile);
      
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        error: error.response?.data?.error?.message || 'Invalid credentials' 
      };
    }
  };

  const logout = () => {
    setSigningOut(true);
    try {
      authService.logout();
      setUser(null);
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    } catch (error) {
      console.error('Error signing out:', error);
      // Still redirect even if there's an error
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    } finally {
      setSigningOut(false);
    }
  };

  const isSuperAdmin = user?.isSuperAdmin || false;
  const centerName = user?.assignedCenter?.name || null;

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signingOut,
      login, 
      logout, 
      isSuperAdmin,
      centerName
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useStrapiAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useStrapiAuth must be used within a StrapiAuthProvider');
  }
  return context;
}
