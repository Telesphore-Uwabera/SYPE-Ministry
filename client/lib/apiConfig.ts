// API Configuration for Frontend
// In production, this will use environment variables
// In development, it uses relative URLs (proxy via Vite)

const getApiBaseUrl = (): string => {
  // Check for environment variable (Vite uses VITE_ prefix)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // For development, use relative URLs (proxied by Vite dev server)
  // For production with same domain, use relative URLs
  // For production with different domains, use full URL from env
  if (import.meta.env.PROD && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In production, if no env var is set, use the Render backend URL as fallback
  if (import.meta.env.PROD) {
    const fallbackUrl = "https://sype-ministry.onrender.com";
    console.warn(`API base URL not configured. Using fallback: ${fallbackUrl}`);
    console.warn("Please set VITE_API_BASE_URL or VITE_API_URL in Netlify environment variables");
    return fallbackUrl;
  }
  
  // Default to relative URL (works when frontend and backend share domain)
  return "";
};

export const API_BASE_URL = getApiBaseUrl();

const CACHE_TTL_MS = 5 * 60 * 1000;
const responseCache = new Map<
  string,
  {
    expiresAt: number;
    status: number;
    statusText: string;
    headers: [string, string][];
    body: string;
  }
>();

const isCacheDisabled = (init?: RequestInit, headers?: Headers): boolean => {
  const cacheMode = init?.cache;
  const cacheControl = headers?.get("cache-control") || "";
  return (
    cacheMode === "no-store" ||
    cacheControl.includes("no-store") ||
    cacheControl.includes("no-cache")
  );
};

const hasAuthHeader = (headers?: Headers): boolean => {
  if (!headers) return false;
  return headers.has("authorization") || headers.has("Authorization");
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  
  if (API_BASE_URL) {
    // Ensure API_BASE_URL doesn't have trailing slash
    const baseUrl = API_BASE_URL.endsWith("/") 
      ? API_BASE_URL.slice(0, -1) 
      : API_BASE_URL;
    return `${baseUrl}/${cleanEndpoint}`;
  }
  
  // Use relative URL
  return `/${cleanEndpoint}`;
};

// Helper function for fetch requests
export const apiFetch = async (
  endpoint: string,
  options?: RequestInit
): Promise<Response> => {
  const url = buildApiUrl(endpoint);
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
};

// Override global fetch to use API base URL automatically
// This ensures all fetch("/api/...") calls use the correct backend URL
const originalFetch = window.fetch;
window.fetch = async function (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const isStringInput = typeof input === "string";
  const method =
    (init?.method || (input instanceof Request ? input.method : "GET")).toUpperCase();

  let resolvedInput = input;
  if (isStringInput && (input as string).startsWith("/api/")) {
    resolvedInput = buildApiUrl(input as string);
  }

  const headers =
    (init?.headers && new Headers(init.headers)) ||
    (input instanceof Request ? input.headers : undefined);
  const shouldCache =
    method === "GET" && !isCacheDisabled(init, headers) && !hasAuthHeader(headers);

  if (shouldCache && typeof resolvedInput === "string") {
    const cached = responseCache.get(resolvedInput);
    if (cached && cached.expiresAt > Date.now()) {
      return new Response(cached.body, {
        status: cached.status,
        statusText: cached.statusText,
        headers: cached.headers,
      });
    }
    responseCache.delete(resolvedInput);
  }

  const response = await originalFetch.call(this, resolvedInput, init);

  if (shouldCache && typeof resolvedInput === "string" && response.ok) {
    const cloned = response.clone();
    const body = await cloned.text();
    responseCache.set(resolvedInput, {
      expiresAt: Date.now() + CACHE_TTL_MS,
      status: response.status,
      statusText: response.statusText,
      headers: Array.from(response.headers.entries()),
      body,
    });
  }

  return response;
};
