const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3000";

// Helper function to get JWT from localStorage
const getStoredJWT = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("jwt");
};

// Helper function to store JWT
const storeJWT = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("jwt", token);
};

// Note: Refresh tokens are httpOnly cookies and cannot be accessed via JavaScript
// This is by design for security. The browser will automatically send them with requests.
const canAccessRefreshToken = (): boolean => {
  // We can't directly access httpOnly cookies, but we can check if a request
  // with credentials: 'include' to the refresh endpoint works
  return typeof window !== "undefined";
};

// Helper function to clear tokens and redirect to login
const clearTokensAndRedirect = () => {
  console.log("🚪 All token refresh attempts failed, redirecting to login");

  // Clear stored tokens
  localStorage.removeItem("jwt");
  sessionStorage.removeItem("adminToken");
  sessionStorage.removeItem("adminUser");

  // Call backend logout to clear refresh token
  fetch(`${BACKEND_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  }).catch(() => {}); // Ignore errors

  // Redirect to login page
  window.location.href = "/sign-in";
};

// Helper function to check if JWT is expired (client-side check)
const isJWTExpired = (token: string): boolean => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const payload = JSON.parse(jsonPayload);
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return true; // Treat invalid tokens as expired
  }
};

// Helper function to attempt token refresh using httpOnly refresh token cookie
const attemptRefreshToken = async (): Promise<string | null> => {
  try {
    console.log(
      " Attempting to refresh token using httpOnly refresh token cookie...",
    );

    // Check if we can potentially access refresh token (browser environment)
    if (!canAccessRefreshToken()) {
      console.log(" Cannot attempt refresh token in server environment");
      return null;
    }

    // Call refresh endpoint - browser will automatically send httpOnly cookies
    const response = await fetch(`${BACKEND_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Critical: Include httpOnly cookies automatically
    });

    if (response.ok) {
      const data = await response.json();

      if (data.token) {
        console.log(
          " Token refreshed successfully using httpOnly refresh token",
        );
        storeJWT(data.token);

        // Update JWT context if available
        if (typeof window !== "undefined" && (window as any).updateJWTContext) {
          (window as any).updateJWTContext(data.token);
        }

        return data.token;
      } else {
        console.log(" Refresh response missing token field");
        return null;
      }
    } else {
      console.log(
        ` Refresh token request failed: ${response.status} ${response.statusText}`,
      );
      const errorData = await response.json().catch(() => ({}));
      console.log("Refresh error details:", errorData);

      // If it's a 401, the refresh token is invalid/expired
      if (response.status === 401) {
        console.log(" Refresh token expired or invalid");
      }

      return null;
    }
  } catch (error) {
    console.error(" Refresh token request error:", error);
    return null;
  }
};

// Enhanced fetch function with automatic token handling and refresh
interface ApiOptions extends RequestInit {
  skipAuth?: boolean;
  baseURL?: string;
  _retry?: boolean; // Internal flag to prevent infinite loops
}

const apiClient = async (
  url: string,
  options: ApiOptions = {},
): Promise<Response> => {
  const {
    skipAuth = false,
    baseURL = BACKEND_BASE_URL,
    _retry = false,
    ...fetchOptions
  } = options;

  // Prepare headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  // Add authorization header if not skipping auth
  if (!skipAuth) {
    let token = getStoredJWT();

    if (token) {
      // Check if token is expired before making request
      if (isJWTExpired(token)) {
        console.log("⚠️ JWT expired before request, attempting refresh...");

        // Try to refresh token
        const refreshedToken = await attemptRefreshToken();

        if (refreshedToken) {
          token = refreshedToken;
        } else {
          // Refresh failed, redirect to login
          clearTokensAndRedirect();
          throw new Error(
            "Token expired and refresh failed - redirecting to login",
          );
        }
      }

      headers.Authorization = `Bearer ${token}`;
    }
  }

  // Construct full URL
  const fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`;

  try {
    console.log(` API Request: ${fetchOptions.method || "GET"} ${fullUrl}`);

    const response = await fetch(fullUrl, {
      ...fetchOptions,
      headers,
      credentials: "include", // Include cookies for refresh token
    });

    // Handle token expiry with automatic retry
    if (response.status === 401 && !skipAuth && !_retry) {
      const responseClone = response.clone(); // Clone to read body without consuming it
      const errorData = await responseClone.json().catch(() => ({}));

      // Check if it's a token-related error
      if (
        errorData?.error?.includes("Token expired") ||
        errorData?.error?.includes("Invalid token") ||
        errorData?.error?.includes("Unauthorized") ||
        errorData?.code === "TOKEN_EXPIRED"
      ) {
        console.log(" Received 401 error, attempting token refresh...");

        // Try to refresh token
        const refreshedToken = await attemptRefreshToken();

        if (refreshedToken) {
          console.log(" Retrying original request with refreshed token");

          // Retry the original request with new token and _retry flag
          return await apiClient(url, {
            ...options,
            _retry: true, // Prevent infinite loops
          });
        } else {
          // Refresh failed, redirect to login
          console.log(" Token refresh failed, redirecting to login");
          clearTokensAndRedirect();
          throw new Error("Authentication expired. Please login again.");
        }
      }
    }

    return response;
  } catch (error) {
    console.error(" API Request failed:", {
      url: fullUrl,
      method: fetchOptions.method || "GET",
      error: error instanceof Error ? error.message : "Unknown error",
    });

    throw error;
  }
};

// Convenience methods
const apiGet = (url: string, options: ApiOptions = {}) =>
  apiClient(url, { ...options, method: "GET" });

const apiPost = (url: string, data?: any, options: ApiOptions = {}) =>
  apiClient(url, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });

const apiPut = (url: string, data?: any, options: ApiOptions = {}) =>
  apiClient(url, {
    ...options,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });

const apiDelete = (url: string, options: ApiOptions = {}) =>
  apiClient(url, { ...options, method: "DELETE" });

const apiPatch = (url: string, data?: any, options: ApiOptions = {}) =>
  apiClient(url, {
    ...options,
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });

// Helper function to handle API responses with automatic error handling
const handleApiResponse = async <T = any>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: `HTTP ${response.status}: ${response.statusText}`,
    }));

    throw new Error(
      errorData.error || errorData.message || `HTTP ${response.status}`,
    );
  }

  // Handle different content types
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return (await response.json()) as T;
  } else if (contentType && contentType.includes("text/")) {
    return (await response.text()) as T;
  } else {
    return (await response.blob()) as T;
  }
};

// Export the API client and helper functions
export {
  apiClient,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiPatch,
  handleApiResponse,
  getStoredJWT,
  clearTokensAndRedirect,
  isJWTExpired,
  attemptRefreshToken,
};

// Export default as the main client
export default apiClient;
