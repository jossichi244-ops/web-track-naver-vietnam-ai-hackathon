const API_BASE = "http://localhost:8000";

export async function request<T>(
  path: string,
  opts: RequestInit = {},
  accessToken?: string
): Promise<T> {
  let incomingHeaders: Record<string, string> = {};

  if (opts.headers) {
    if (opts.headers instanceof Headers) {
      opts.headers.forEach((value, key) => {
        incomingHeaders[key] = value;
      });
    } else if (Array.isArray(opts.headers)) {
      opts.headers.forEach(([key, value]) => {
        incomingHeaders[key] = value;
      });
    } else {
      incomingHeaders = { ...opts.headers };
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...incomingHeaders,
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  return res.json();
}
