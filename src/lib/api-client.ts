export type PostResult<T> = { data: T; error: null } | { data: null; error: string };

/**
 * POST JSON to an API route and normalise failures (non-2xx, network errors)
 * into a user-displayable error message instead of throwing or being ignored.
 */
export async function postJson<T = unknown>(url: string, body: unknown): Promise<PostResult<T>> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
