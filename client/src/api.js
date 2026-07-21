import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

axios.defaults.baseURL = API_URL;

export const register = async (name, email, password) =>
  axios.post('/auth/register', { name, email, password });

export const login = async (email, password) => axios.post('/auth/login', { email, password });

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    try {
      localStorage.setItem('token', token);
    } catch {
      /* non-fatal */
    }
  } else {
    delete axios.defaults.headers.common.Authorization;
    try {
      localStorage.removeItem('token');
    } catch {
      /* non-fatal */
    }
  }
};

/**
 * Tokens expire after a day. Without this, an expired session surfaced as a
 * generic "could not load your notes" error on a screen that still looked
 * signed in, with no way forward except clearing storage by hand.
 *
 * AuthProvider registers the handler so the interceptor stays out of React
 * state management.
 */
let onUnauthorized = null;

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isAuthRoute = /\/auth\/(login|register)$/.test(error.config?.url || '');

    // A 401 from the login form means "wrong password", not "session expired"
    if (status === 401 && !isAuthRoute && onUnauthorized) {
      onUnauthorized();
    }

    return Promise.reject(error);
  }
);
