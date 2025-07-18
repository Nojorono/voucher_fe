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

// ✅ Different configuration for file uploads
const createAPIClient = (isFileUpload = false) => {
  const config = {
    baseURL: API_BASE_URL,
    timeout: isFileUpload ? 120000 : 30000,
    headers: isFileUpload ? {} : { 'Content-Type': 'application/json' },
    withCredentials: false, // Important for CORS
  };

  const client = axios.create(config);

  // Add request interceptor for debugging
  client.interceptors.request.use(
    (config) => {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error('API Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor for debugging
  client.interceptors.response.use(
    (response) => {
      console.log(`API Response: ${response.status} ${response.config.url}`);
      return response;
    },
    (error) => {
      console.error('API Response Error:', {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });
      return Promise.reject(error);
    }
  );

  return client;
};

const API = createAPIClient();
const FILE_UPLOAD_API = createAPIClient(true);

// Debug logging
console.log('Frontend hostname:', window.location.hostname);
console.log('API Base URL:', API_BASE_URL);

export default API;
export { API_BASE_URL, FILE_UPLOAD_API };
// const API = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 30000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Debug logging
// console.log('Frontend hostname:', window.location.hostname);
// console.log('API Base URL:', API_BASE_URL);

// export default API;
// export { API_BASE_URL };

// Legacy exports for compatibility
export const localURL = API_BASE_URL;
export const stagingURL = API_BASE_URL;
