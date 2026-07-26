import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      } else {
        window.location.reload();
      }
    }
    return Promise.reject(err);
  }
);

export const auth = {
  signup: (data) => api.post('/auth/signup', data),
  login: (username, password) => {
    const form = new URLSearchParams();
    form.append('username', username);
    form.append('password', password);
    return api.post('/auth/login', form, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  },
};

export const user = {
  getProfile: () => api.get('/user/profile'),
  getPreferences: () => api.get('/user/preferences'),
  updatePreference: (key, value) => api.put('/user/preferences', { preference_key: key, preference_value: value }),
  getTrips: () => api.get('/user/trips'),
};

export const query = {
  submit: (data) => api.post('/query', data),
};

export const feedback = {
  submit: (data) => api.post('/feedback/', data),
};

export default api;
