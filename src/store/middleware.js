import { isRejectedWithValue } from '@reduxjs/toolkit';

/**
 * Middleware to handle API errors globally
 */
export const errorMiddleware = (api) => (next) => (action) => {
  // Check if the action is a rejected API call
  if (isRejectedWithValue(action)) {
    // You can log errors, show notifications, etc.
    const { payload, error } = action;
    
    // Handle 401 Unauthorized errors (token expired)
    if (payload?.status === 401) {
      // Custom event to trigger logout across the app
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    
    // Log the error
    console.error('API Error:', payload || error);
  }
  
  return next(action);
};