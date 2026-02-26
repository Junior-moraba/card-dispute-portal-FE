export interface LoginRequest {
  phoneNumber: string;
}

export interface OtpRequest {
  phoneNumber: string;
  otp: string;
}

export interface AuthResponse {
  data: ResponseData;
  success: boolean;
}

export interface ResponseData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  phoneNumber: string;
  name: string;
}
