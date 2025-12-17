export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetcher<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    credentials: "include",
  });

  let json: ApiResponse<T> | null = null;

  try {
    json = await res.json();
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
  }

  if (!res.ok || !json?.success) {
    throw new Error(json?.message || "API request failed");
  }

  return json.data as T;
}
