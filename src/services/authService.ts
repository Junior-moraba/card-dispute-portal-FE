import type { AuthResponse, LoginRequest, OtpRequest } from '../models/AuthObjects';
import { apiRequest } from './api';


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

  refreshToken: (refreshToken: string) =>
    apiRequest<AuthResponse>('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  logout: (refreshToken?: string) =>
    apiRequest<void>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),
};
