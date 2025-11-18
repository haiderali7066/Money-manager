import { getToken } from "./token-storage";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function apiCall<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Add auth token if available
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data: any;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.error || "API request failed");
  }

  return data;
}
