import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService';
import type { AuthResponse } from '../models/AuthObjects';

interface AuthContextType {
  isAuthenticated: boolean;
  phoneNumber: string | null;
  userId: string | null;
  login: (token: string, phone: string, userId: string) => void;
  logout: () => Promise<void>;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const phone = sessionStorage.getItem('phoneNumber');
    const id = sessionStorage.getItem('userId');
    if (token && phone && id) {
      setIsAuthenticated(true);
      setPhoneNumber(phone);
      setUserId(id);
    }
  }, []);

  const login = (token: string, phone: string, userId: string) => {
    setIsAuthenticated(true);
    setPhoneNumber(phone);
    setUserId(userId);
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('phoneNumber', phone);
    sessionStorage.setItem('userId', userId);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setPhoneNumber(null);
      setUserId(null);
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('phoneNumber');
      sessionStorage.removeItem('userId');
    }
  };

  const sendOtp = async (phone: string) => {
    await authService.sendOtp({ phoneNumber: phone });
  };

  const verifyOtp = async (phone: string, otp: string) => {
    return await authService.verifyOtp({ phoneNumber: phone, otp });
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      phoneNumber, 
      userId,
      login, 
      logout, 
      sendOtp, 
      verifyOtp 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
