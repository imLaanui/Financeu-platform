const API_CONFIG = {
    getApiUrl: () => {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3000/api';
        }
        return `${window.location.origin}/api`;
    }
};

export const API_URL = API_CONFIG.getApiUrl();

console.log(
    '🌐 Environment:',
    window.location.hostname === 'localhost' ? 'Development' : 'Production'
);
console.log('🔗 API URL:', API_URL);
