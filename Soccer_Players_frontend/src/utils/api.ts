import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Configuration de base
const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Pour envoyer les cookies
});

// Intercepteur pour ajouter le CSRF token
api.interceptors.request.use((config) => {
  const csrfToken = localStorage.getItem('csrfToken');
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});

// Intercepteur pour gérer les erreurs et le renouvellement des tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur est une 401 et que ce n'est pas une requête de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tenter de rafraîchir le token
        await axios.post('/api/auth/refresh-token', {}, { withCredentials: true });
        
        // Rejouer la requête originale
        return api(originalRequest);
      } catch (refreshError) {
        // Si le refresh échoue, déconnecter l'utilisateur
        const { logout } = useAuth();
        logout();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;