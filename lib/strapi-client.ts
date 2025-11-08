import axios from 'axios';

const strapiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_URL ,
});

// Add auth token to requests (except for auth endpoints)
strapiClient.interceptors.request.use((config) => {
  // Skip adding token for authentication endpoints
  const isAuthEndpoint = config.url?.includes('/auth/');
  
  if (!isAuthEndpoint && typeof window !== 'undefined') {
    const token = localStorage.getItem('strapi_jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default strapiClient;
