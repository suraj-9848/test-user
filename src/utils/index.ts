/**
 * Decode JWT token to extract user information
 * @param token JWT token string
 * @returns Decoded user information or null if invalid
 */
export function decodeJWT(token: string | null): any {
  if (!token) return null;
  
  try {
    // JWT structure: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode the payload (second part)
    const payload = parts[1];
    // Add padding if needed
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    const decoded = atob(paddedPayload);
    
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 * @param token JWT token string
 * @returns boolean indicating if token is expired
 */
export function isJWTExpired(token: string | null): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

/**
 * Extract user information from JWT
 * @param token JWT token string
 * @returns User information object or null
 */
export function getUserFromJWT(token: string | null): {
  id: string;
  username: string;
  email: string;
  userRole: string;
  profile_picture?: string;
} | null {
  const decoded = decodeJWT(token);
  if (!decoded) return null;

  return {
    id: decoded.id || decoded.userId || 'unknown', // Prioritize 'id' from backend JWT
    username: decoded.username || decoded.name || 'User',
    email: decoded.email || '',
    userRole: decoded.userRole || 'student',
    profile_picture: decoded.profile_picture || null
  };
} 