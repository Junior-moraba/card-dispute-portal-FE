import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  phoneNumber: string | null;
  login: (token: string, phone: string) => void;
  logout: () => Promise<void>;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<{ token: string; phoneNumber: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const phone = localStorage.getItem('phoneNumber');
    if (token && phone) {
      setIsAuthenticated(true);
      setPhoneNumber(phone);
    }
  }, []);

  const login = (token: string, phone: string) => {
    setIsAuthenticated(true);
    setPhoneNumber(phone);
    localStorage.setItem('authToken', token);
    localStorage.setItem('phoneNumber', phone);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setPhoneNumber(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('phoneNumber');
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
