import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  phoneNumber: string | null;
  login: (phone: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const { phone } = JSON.parse(auth);
      setIsAuthenticated(true);
      setPhoneNumber(phone);
    }
  }, []);

  const login = (phone: string) => {
    setIsAuthenticated(true);
    setPhoneNumber(phone);
    localStorage.setItem('auth', JSON.stringify({ phone }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPhoneNumber(null);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, phoneNumber, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
