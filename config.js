// API Configuration - automatically detects environment
const API_CONFIG = {
  // Automatically use current domain in production, localhost in development
  getApiUrl: function() {
    // If we're on localhost, use localhost API
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000/api';
    }
    // Otherwise, use the same domain we're on (production)
    return `${window.location.origin}/api`;
  }
};

// Export for use in all pages
const API_URL = API_CONFIG.getApiUrl();
