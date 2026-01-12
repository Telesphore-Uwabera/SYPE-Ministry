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
  
  // Default to relative URL (works when frontend and backend share domain)
  return "";
};

export const API_BASE_URL = getApiBaseUrl();

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
window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  // Only intercept relative API URLs
  if (typeof input === 'string' && input.startsWith('/api/')) {
    input = buildApiUrl(input);
  }
  return originalFetch.call(this, input, init);
};
