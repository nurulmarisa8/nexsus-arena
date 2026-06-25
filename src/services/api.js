import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000' });

// Request interceptor: attach JWT token
API.interceptors.request.use(config => {
  const token = localStorage.getItem('nexus_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: handle 401
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      const requestUrl = err.config?.url || '';
      // Don't force-redirect on the initial token validation call
      const isAuthCheck = requestUrl.includes('/api/auth/me');
      localStorage.removeItem('nexus_token');
      localStorage.removeItem('nexus_user');
      if (!isAuthCheck) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (email, password) => API.post('/api/auth/login', { email, password }),
  register: (data) => API.post('/api/auth/register', data),
  me: () => API.get('/api/auth/me'),
  updateProfile: (data) => API.patch('/api/auth/me', data),
};

export const teamsAPI = {
  list: () => API.get('/api/teams'),
  create: (data) => API.post('/api/teams', data),
  get: (id) => API.get(`/api/teams/${id}`),
  // Backend uses query param ?username=... not a JSON body
  addMember: (id, username) => API.post(`/api/teams/${id}/members`, null, { params: { username } }),
  removeMember: (teamId, userId) => API.delete(`/api/teams/${teamId}/members/${userId}`),
  leave: (id) => API.post(`/api/teams/${id}/leave`),
  updateStatus: (id, status) => API.patch(`/api/teams/${id}/status`, { status }),
};

export const tournamentsAPI = {
  list: () => API.get('/api/tournaments'),
  create: (data) => API.post('/api/tournaments', data),
  update: (id, data) => API.patch(`/api/tournaments/${id}`, data),
  register: (id) => API.post(`/api/tournaments/${id}/register`),
  brackets: (id) => API.get(`/api/tournaments/${id}/brackets`),
};

export const matchesAPI = {
  list: (params) => API.get('/api/matches', { params }),
  create: (data) => API.post('/api/matches', data),
  submitScore: (id, data) => API.patch(`/api/matches/${id}/score`, data),
};

export const usersAPI = {
  list: (params) => API.get('/api/users', { params }),
  updateStatus: (id, status) => API.patch(`/api/users/${id}/status`, { status }),
  exportCSV: () => API.get('/api/users/export', { responseType: 'blob' }),
};

export const serversAPI = {
  list: () => API.get('/api/servers'),
  create: (data) => API.post('/api/servers', data),
  update: (id, data) => API.patch(`/api/servers/${id}`, data),
  delete: (id) => API.delete(`/api/servers/${id}`),
};

export const statsAPI = {
  admin: () => API.get('/api/stats/admin'),
  player: (userId) => API.get(`/api/stats/player/${userId}`),
};

export const gamesAPI = {
  list: () => API.get('/api/games'),
};

export default API;
