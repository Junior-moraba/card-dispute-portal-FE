import { apiRequest } from './api';

interface LoginRequest {
  phoneNumber: string;
}

interface OtpRequest {
  phoneNumber: string;
  otp: string;
}

interface AuthResponse {
  token: string;
  phoneNumber: string;
}

export const authService = {
  sendOtp: (request: LoginRequest) =>
    apiRequest<void>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber: request.phoneNumber }),
    }),

  verifyOtp: (request: OtpRequest) =>
    apiRequest<AuthResponse>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber: request.phoneNumber, otp: request.otp }),
    }),

  logout: () =>
    apiRequest<void>('/auth/logout', {
      method: 'POST',
    }),
};
