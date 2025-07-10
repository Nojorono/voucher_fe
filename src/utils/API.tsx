// Use environment variables with fallbacks
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082';

const localURL = API_BASE_URL;
const stagingURL = API_BASE_URL;  // For consistency in local development

export { localURL, stagingURL };