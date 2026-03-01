export const API_BASE_URL = "http://localhost:7231/api";
//TODO: configure SSL

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = sessionStorage.getItem("authToken");

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    throw new ApiError(response.status, `API Error: ${response.statusText}`);
  }

  return response.json();
};
