import axios from 'axios';

const getBaseURL = () => {
  return import.meta.env.VITE_API_BASE_URL || '';
};

const API_BASE_URL = getBaseURL();

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Debug logging
// console.log('Frontend hostname:', window.location.hostname);
// console.log('API Base URL:', API_BASE_URL);

export default API;
export { API_BASE_URL };

// Legacy exports for compatibility
export const localURL = API_BASE_URL;
export const stagingURL = API_BASE_URL;
