const getBaseURL = () => {
  const hostname = window.location.hostname;
  
  // Development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8081';
  }
  
  // Production via ALB
  if (hostname.includes('kcsi-alb-prod')) {
    return `http://${hostname}:8082`;
  }
  
  // Fallback untuk IP langsung
  return `http://${hostname}:8081`;
};

const localURL = getBaseURL();
const stagingURL = getBaseURL();

export { localURL, stagingURL };
