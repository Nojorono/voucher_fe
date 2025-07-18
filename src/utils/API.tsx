import axios from 'axios';

const getBaseURL = () => {
  const hostname = window.location.hostname;

  // Localhost development
  if (hostname === 'ryo.localhost') {
    return 'http://apiryo.localhost'; // ✅ Domain-to-domain
  }

  // Production domains (HTTP only for now)
  if (hostname === 'ryo.kcsi.id') {
    return 'http://apiryo.kcsi.id'; // ✅ HTTP backend
  }

  // Development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000';
  }

  // ALB fallback
  if (hostname.includes('kcsi-alb-prod')) {
    return `http://${hostname}:8082`;
  }

  // Fallback untuk IP langsung
  return `http://${hostname}:8000`;
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
console.log('Frontend hostname:', window.location.hostname);
console.log('API Base URL:', API_BASE_URL);

export default API;
export { API_BASE_URL };

// Legacy exports for compatibility
export const localURL = API_BASE_URL;
export const stagingURL = API_BASE_URL;
