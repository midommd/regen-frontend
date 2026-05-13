/**
 * Global API Configuration
 * Toggle IS_MOCK to true to use the fallback logic.
 * Set to false when your Laravel backend is ready.
 */

const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  IS_MOCK: false, 
};

export default config;