import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

axios.defaults.baseURL = API_URL;

const TOKEN_KEY = 'token';

const readStoredToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

// Held in a module variable as well as localStorage so a request issued in the
// same tick as sign-in still sees it.
let currentToken = readStoredToken();

export const setAuthToken = (token) => {
  currentToken = token || null;

  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* non-fatal: the in-memory token still works for this tab */
  }
};

/**
 * Attach the token per request rather than mutating axios.defaults from an
 * effect.
 *
 * The previous approach set the default header inside AuthProvider's
 * useEffect. React flushes passive effects child-first, so NotesDashboard's
 * mount effect fired `GET /notes` *before* AuthProvider's effect had attached
 * the header. That request went out unauthenticated, came back 401, and the
 * response interceptor below correctly — but misleadingly — reported it as an
 * expired session. Every page load on /app hit this.
 */
axios.interceptors.request.use((config) => {
  const token = currentToken || readStoredToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const register = async (name, email, password) =>
  axios.post('/auth/register', { name, email, password });

export const login = async (email, password) => axios.post('/auth/login', { email, password });

/**
 * Tokens expire after a day. Without this, an expired session surfaced as a
 * generic "could not load your notes" error on a screen that still looked
 * signed in, with no way forward except clearing storage by hand.
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

    // Only treat a 401 as an expired session if we actually sent a token.
    // Otherwise a request that raced ahead of sign-in would sign the user
    // straight back out.
    const sentToken = Boolean(error.config?.headers?.Authorization);

    if (status === 401 && !isAuthRoute && sentToken && onUnauthorized) {
      onUnauthorized();
    }

    return Promise.reject(error);
  }
);
