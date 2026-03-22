/**
 * API Configuration
 * 
 * Handles both local development and production environments
 */

// Determine API URL based on environment
const getApiUrl = (): string => {
  // If explicitly set in environment
  if (typeof import.meta.env.VITE_API_URL !== 'undefined' && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // In production (Netlify, Vercel, etc)
  if (import.meta.env.PROD) {
    // Check if backend is on same domain
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      // For Netlify functions or same-domain backend
      return window.location.origin;
    }
  }

  // In development
  if (import.meta.env.DEV) {
    return 'http://localhost:3000';
  }

  // Fallback
  return 'http://localhost:3000';
};

export const API_URL = getApiUrl();

// API endpoints
export const API_ENDPOINTS = {
  HEALTH: `${API_URL}/api/health`,
  SEARCH_MUSIC: `${API_URL}/api/search-music`,
  TOP_PICKS: `${API_URL}/api/top-picks`,
  STREAM: (videoId: string) => `${API_URL}/api/stream?videoId=${videoId}`,
};

// Check if API is available
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(API_ENDPOINTS.HEALTH, { timeout: 5000 });
    return response.ok;
  } catch {
    return false;
  }
};

export default API_URL;
