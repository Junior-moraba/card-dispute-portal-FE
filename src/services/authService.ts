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

  logout: () =>
    apiRequest<void>('/auth/logout', {
      method: 'POST',
    }),
};
