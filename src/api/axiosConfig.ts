import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Puerto del backend de Leonardo
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el Token JWT a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;