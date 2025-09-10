import { API_BASE } from "../constants/api";

function getAuthToken(): string | null {
  const stored = localStorage.getItem("user");
  if (!stored) return null;

  try {
    const user = JSON.parse(stored);
    const token = user?.access_token;

    return token || null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return null;
  }
}

function normalizeHeaders(
  headers: HeadersInit | undefined
): Record<string, string> {
  if (!headers) return {};

  if (headers instanceof Headers) {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }

  return headers;
}

export async function request<T>(
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  const baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const normalized = normalizeHeaders(opts.headers);
  const token = getAuthToken();

  if (token) normalized["Authorization"] = `Bearer ${token}`;
  //   console.log("Token:", localStorage.getItem("token"));

  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      ...baseHeaders,
      ...normalized,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  return res.json();
}
