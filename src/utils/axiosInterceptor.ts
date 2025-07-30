import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { BASE_URLS, API_ENDPOINTS, DOMAIN_MAPPINGS, getAdminDashboardUrl } from '../config/urls';

// Create axios instance with centralized base URL
const apiClient = axios.create({
  baseURL: BASE_URLS.BACKEND,
  timeout: 30000,
  withCredentials: true, // Important for cookies
});

// Helper function to get JWT from localStorage
const getStoredJWT = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jwt');
};

// Helper function to store JWT
const storeJWT = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('jwt', token);
};

// Note: Refresh tokens are httpOnly cookies and cannot be accessed via JavaScript
// This is by design for security. The browser will automatically send them with requests.
const canAccessRefreshToken = (): boolean => {
  return typeof window !== 'undefined';
};

// Helper function to check if JWT is expired (client-side check)
const isJWTExpired = (token: string): boolean => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return true; // Treat invalid tokens as expired
  }
};

// Helper function to clear tokens and redirect to login
const clearTokensAndRedirect = async () => {
  console.log('🚪 All token refresh attempts failed, redirecting to login');
  
  // Clear stored tokens
  localStorage.removeItem('jwt');
  sessionStorage.removeItem('adminToken');
  sessionStorage.removeItem('adminUser');
  
  // Call backend logout to clear refresh token
  try {
    await fetch(`${BASE_URLS.BACKEND}${API_ENDPOINTS.AUTH.LOGOUT}`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Backend logout failed:', error);
  }
  
  // Sign out from NextAuth to prevent auto-login loop
  try {
    const { signOut } = await import('next-auth/react');
    await signOut({ redirect: false });
  } catch (error) {
    console.error('NextAuth signOut failed:', error);
  }
  
  // Redirect to login page
  window.location.href = '/sign-in';
};

// Helper function to attempt token refresh using httpOnly refresh token cookie
const attemptRefreshToken = async (): Promise<string | null> => {
  try {
    console.log('🔄 Attempting to refresh token using httpOnly refresh token cookie...');
    
    // Check if we can potentially access refresh token (browser environment)
    if (!canAccessRefreshToken()) {
      console.log('❌ Cannot attempt refresh token in server environment');
      return null;
    }
    
    // Call refresh endpoint using centralized URL - browser will automatically send httpOnly cookies
    const response = await fetch(`${BASE_URLS.BACKEND}${API_ENDPOINTS.AUTH.REFRESH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Critical: Include httpOnly cookies automatically
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.token) {
        console.log('✅ Token refreshed successfully using httpOnly refresh token');
        storeJWT(data.token);
        
        // Update JWT context if available
        if (typeof window !== 'undefined' && (window as any).updateJWTContext) {
          (window as any).updateJWTContext(data.token);
        }
        
        return data.token;
      } else {
        console.log('❌ Refresh response missing token field');
        return null;
      }
    } else {
      console.log(`❌ Refresh token request failed: ${response.status} ${response.statusText}`);
      const errorData = await response.json().catch(() => ({}));
      console.log('Refresh error details:', errorData);
      
      // If it's a 401, the refresh token is invalid/expired
      if (response.status === 401) {
        console.log('🔄 Refresh token expired or invalid');
      }
      
      return null;
    }
  } catch (error) {
    console.error('❌ Refresh token request error:', error);
    return null;
  }
};

// Request interceptor - Add authorization header and handle pre-flight token checks
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let token = getStoredJWT();
    
    if (token) {
      // Check if token is expired before making request
      if (isJWTExpired(token)) {
        console.log('⚠️ JWT expired before request, attempting refresh...');
        
        // Try to refresh token
        const refreshedToken = await attemptRefreshToken();
        
        if (refreshedToken) {
          token = refreshedToken;
        } else {
          // Refresh failed, redirect to login
          await clearTokensAndRedirect();
          throw new Error('Authentication expired. Please login again.');
        }
      }
      
      // Add token to request header
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token expiry and authentication errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Request successful, return response
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Check if error is due to token expiry/invalidity
    if (error.response?.status === 401 && !originalRequest._retry) {
      const errorData = error.response.data as any;
      
      // Check if it's a token-related error
      if (
        errorData?.error?.includes('Token expired') ||
        errorData?.error?.includes('Invalid token') ||
        errorData?.error?.includes('Unauthorized') ||
        errorData?.code === 'TOKEN_EXPIRED'
      ) {
        console.log('🔄 Received 401 error, attempting token refresh...');
        
        // Mark request as retried to prevent infinite loops
        originalRequest._retry = true;
        
        try {
          // Try to refresh token
          const refreshedToken = await attemptRefreshToken();
          
          if (refreshedToken) {
            // Update the original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${refreshedToken}`;
            }
            
            // Retry the original request
            console.log('🔄 Retrying original request with refreshed token');
            return apiClient(originalRequest);
          } else {
            // Refresh failed, redirect to login
            console.log('🔄 Token refresh failed, redirecting to login');
            await clearTokensAndRedirect();
            throw new Error('Authentication expired. Please login again.');
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          await clearTokensAndRedirect();
          throw new Error('Authentication expired. Please login again.');
        }
      }
    }
    
    // Handle other errors normally
    console.error('API Request failed:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    
    return Promise.reject(error);
  }
);

// Convenience methods that return axios responses directly
export const apiGet = (url: string, config?: AxiosRequestConfig) => 
  apiClient.get(url, config);

export const apiPost = (url: string, data?: any, config?: AxiosRequestConfig) =>
  apiClient.post(url, data, config);

export const apiPut = (url: string, data?: any, config?: AxiosRequestConfig) =>
  apiClient.put(url, data, config);

export const apiDelete = (url: string, config?: AxiosRequestConfig) =>
  apiClient.delete(url, config);

export const apiPatch = (url: string, data?: any, config?: AxiosRequestConfig) =>
  apiClient.patch(url, data, config);

// Export the configured axios instance as default
export default apiClient;

// Export helper functions for use in components
export { 
  getStoredJWT,
  storeJWT,
  clearTokensAndRedirect,
  isJWTExpired,
  attemptRefreshToken,
}; 