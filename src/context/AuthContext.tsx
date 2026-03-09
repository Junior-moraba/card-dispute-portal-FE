import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { authService } from "../services/authService";
import type { AuthResponse } from "../models/AuthObjects";
import { logger } from "../services/logger";

interface AuthContextType {
  isAuthenticated: boolean;
  phoneNumber: string | null;
  userId: string | null;
  isLoading: boolean;
  login: (
    token: string,
    phone: string,
    userId: string,
    refreshToken?: string,
  ) => void;
  logout: () => Promise<void>;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<AuthResponse>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const parseJWT = (token: string) => {
  try {
    // Check if token has 3 parts separated by dots (valid JWT format)
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.warn("Token is not a valid JWT format");
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);

    return JSON.parse(atob(paddedPayload));
  } catch (error) {
    console.error("Failed to parse JWT token:", error);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    logger.info('User Logout', { userId: sessionStorage.getItem('userId') });
    try {
      const refreshToken = sessionStorage.getItem("refreshToken");
      await authService.logout(refreshToken || undefined);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
      setPhoneNumber(null);
      setUserId(null);
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("phoneNumber");
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("refreshToken");
    }
  }, []);

  const refreshToken = useCallback(async () => {
     logger.debug('Token Refresh Attempt');
    try {
      logger.info('Token Refresh Success');
      const refreshTokenValue = sessionStorage.getItem("refreshToken");
      if (!refreshTokenValue) throw new Error("No refresh token");

      const response = await authService.refreshToken(refreshTokenValue);
      sessionStorage.setItem("authToken", response.data.accessToken);
      if (response.data.refreshToken) {
        sessionStorage.setItem("refreshToken", response.data.refreshToken);
      }
    } catch (error) {
      logger.error('Token Refresh Failed', error);
      console.error("Token refresh failed:", error);
      logout();
    }
  }, [logout]);

  const checkTokenExpiry = useCallback(() => {
    const token = sessionStorage.getItem("authToken");
    if (!token) return;

    const payload = parseJWT(token);
    if (!payload?.exp) return;

    const now = Date.now() / 1000;
    const timeUntilExpiry = payload.exp - now;

    if (timeUntilExpiry <= 0) {
      logout();
    } else if (timeUntilExpiry <= 60) {
      const keepActive = confirm(
        "Your session will expire soon. Do you want to keep it active?",
      );
      if (keepActive) {
        refreshToken();
      } else {
        logout();
      }
    }
  }, [logout, refreshToken]);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    const phone = sessionStorage.getItem("phoneNumber");
    const id = sessionStorage.getItem("userId");

    if (token && phone && id) {
      setIsAuthenticated(true);
      setPhoneNumber(phone);
      setUserId(id);
      checkTokenExpiry();
    }
    setIsLoading(false);
  }, [checkTokenExpiry]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(checkTokenExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [isAuthenticated, checkTokenExpiry]);

  const login = (
    token: string,
    phone: string,
    userId: string,
    refreshToken?: string,
  ) => {

    logger.info('User Login', { userId, phone: phone.slice(-4) }); 
    setIsAuthenticated(true);
    setPhoneNumber(phone);
    setUserId(userId);
    sessionStorage.setItem("authToken", token);
    sessionStorage.setItem("phoneNumber", phone);
    sessionStorage.setItem("userId", userId);
    if (refreshToken) {
      sessionStorage.setItem("refreshToken", refreshToken);
    }
  };

  const sendOtp = async (phone: string) => {
    await authService.sendOtp({ phoneNumber: phone });
  };

  const verifyOtp = async (phone: string, otp: string) => {
    return await authService.verifyOtp({ phoneNumber: phone, otp });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        phoneNumber,
        userId,
        isLoading,
        login,
        logout,
        sendOtp,
        verifyOtp,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
