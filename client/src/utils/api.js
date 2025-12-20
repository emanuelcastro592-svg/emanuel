import axios from 'axios';
import { getAuthToken } from './auth';

// Detectar automaticamente a URL da API baseado no ambiente
const getApiUrl = () => {
  // Se REACT_APP_API_URL estiver definido, usar ele
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Se estiver em produção e não tiver variável, usar a URL atual
  if (process.env.NODE_ENV === 'production') {
    // Em produção, usar a mesma origem (mesmo domínio)
    return '/api';
  }
  
  // Em desenvolvimento, usar localhost
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Se não houver resposta, é erro de conexão
    if (!error.response) {
      error.message = 'Não foi possível conectar ao servidor. Verifique se o servidor está rodando.';
    }
    return Promise.reject(error);
  }
);

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Trainers
export const getTrainers = () => api.get('/trainers');
export const getTrainer = (id) => api.get(`/trainers/${id}`);

// Services
export const getTrainerServices = (trainerId) => api.get(`/services/trainer/${trainerId}`);
export const createService = (data) => api.post('/services', data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);
export const getService = (id) => api.get(`/services/${id}`);

// Appointments
export const createAppointment = (data) => api.post('/appointments', data);
export const getClientAppointments = () => api.get('/appointments/client/my-appointments');
export const getTrainerAppointments = () => api.get('/appointments/trainer/my-appointments');
export const updateAppointmentStatus = (id, status) => api.patch(`/appointments/${id}/status`, { status });
export const getAppointment = (id) => api.get(`/appointments/${id}`);

// Requests
export const createRequest = (data) => api.post('/requests', data);
export const getClientRequests = () => api.get('/requests/client/my-requests');
export const getTrainerRequests = () => api.get('/requests/trainer/my-requests');
export const updateRequestStatus = (id, status) => api.patch(`/requests/${id}/status`, { status });
export const getRequest = (id) => api.get(`/requests/${id}`);

// Ratings
export const createRating = (data) => api.post('/ratings', data);
export const getTrainerRatings = (trainerId) => api.get(`/ratings/trainer/${trainerId}`);
export const getClientRatings = () => api.get('/ratings/client/my-ratings');
export const updateRating = (id, data) => api.put(`/ratings/${id}`, data);
export const deleteRating = (id) => api.delete(`/ratings/${id}`);

// Notifications
export const getNotifications = () => api.get('/notifications/my-notifications');
export const getUnreadCount = () => api.get('/notifications/unread-count');
export const markAsRead = (id) => api.patch(`/notifications/${id}/read`);
export const markAllAsRead = () => api.patch('/notifications/mark-all-read');
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);

// Stats
export const getStats = () => api.get('/stats');

// Users
export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (data) => api.put('/users/profile', data);

export default api;



