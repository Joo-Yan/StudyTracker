export type RequestResult<T> = { data: T; error: null } | { data: null; error: string };
export type PostResult<T> = RequestResult<T>;

/**
 * Send a JSON request to an API route and normalise failures (non-2xx,
 * network errors) into a user-displayable error message instead of throwing
 * or being ignored.
 */
export async function requestJson<T = unknown>(
  method: "POST" | "PATCH" | "PUT" | "DELETE",
  url: string,
  body?: unknown
): Promise<RequestResult<T>> {
  try {
    const res = await fetch(url, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const data = (await res.json().catch(() => null)) as (T & { error?: string }) | null;
    if (!res.ok) {
      return { data: null, error: data?.error ?? "Something went wrong. Please try again." };
    }
    return { data: data as T, error: null };
  } catch {
    return { data: null, error: "Network error. Please check your connection and try again." };
  }
}

export function postJson<T = unknown>(url: string, body: unknown): Promise<RequestResult<T>> {
  return requestJson<T>("POST", url, body);
}
