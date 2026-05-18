import axios from 'axios';

let baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Ensure the baseURL ends with /api/v1 if it's missing (e.g., from Railway env vars)
if (baseURL && !baseURL.endsWith('/api/v1')) {
  // Remove trailing slash if present before appending
  baseURL = baseURL.replace(/\/$/, '') + '/api/v1';
}

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;
