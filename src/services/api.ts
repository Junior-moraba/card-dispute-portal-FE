import { logger } from './logger';

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:7231/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public endpoint?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const startTime = performance.now();
  const token = sessionStorage.getItem("authToken");

  logger.debug('API Request', {
    requestId,
    endpoint,
    method: options.method || 'GET',
  });

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      'X-Request-ID': requestId,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const duration = performance.now() - startTime;

    if (!response.ok) {
      const error = new ApiError(response.status, `API Error: ${response.statusText}`, endpoint);
      
      logger.error('API Request Failed', error, {
        requestId,
        endpoint,
        status: response.status,
        duration: `${duration.toFixed(2)}ms`,
      });

      throw error;
    }

    logger.info('API Request Success', {
      requestId,
      endpoint,
      status: response.status,
      duration: `${duration.toFixed(2)}ms`,
    });

    return response.json();
  } catch (error) {
    const duration = performance.now() - startTime;

    if (error instanceof ApiError) {
      throw error;
    }

    logger.error('API Request Exception', error, {
      requestId,
      endpoint,
      duration: `${duration.toFixed(2)}ms`,
    });

    throw error;
  }
};
