import { jwtDecode } from 'jwt-decode';

/**
 * Store authentication tokens in local storage
 * @param {string} accessToken - JWT access token
 * @param {string} refreshToken - JWT refresh token
 */
export const storeTokens = (accessToken, refreshToken) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

/**
 * Remove authentication tokens from local storage
 */
export const removeTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

/**
 * Get the access token from local storage
 * @returns {string|null} - The access token or null
 */
export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

/**
 * Get the refresh token from local storage
 * @returns {string|null} - The refresh token or null
 */
export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

/**
 * Check if the access token is expired
 * @returns {boolean} - True if expired or not present, false otherwise
 */
export const isTokenExpired = () => {
  const token = getAccessToken();
  if (!token) return true;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Get the user ID from the access token
 * @returns {number|null} - The user ID or null
 */
export const getUserIdFromToken = () => {
  const token = getAccessToken();
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.user_id;
  } catch (error) {
    return null;
  }
};

/**
 * Get the user type from the access token
 * @returns {string|null} - The user type or null
 */
export const getUserTypeFromToken = () => {
  const token = getAccessToken();
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.user_type;
  } catch (error) {
    return null;
  }
};