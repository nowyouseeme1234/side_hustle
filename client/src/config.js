// config.js
export const API_BASE_URL = 'http://localhost:3000';

export const updateApiBaseUrl = (newUrl) => {
  window.API_BASE_URL = newUrl;
};

// Attach it to the window object to make it globally accessible
window.API_BASE_URL = API_BASE_URL;
window.updateApiBaseUrl = updateApiBaseUrl;