import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { setAuthToken } from './api';

export const AuthContext = createContext(null);

const USER_KEY = 'ai-notes:user';
const TOKEN_KEY = 'token';

// localStorage throws in some private-browsing modes, and stored JSON can be
// corrupt, so every access is guarded rather than assumed to succeed.
const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const readStoredToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  // Session is restored synchronously on first render. Previously only the
  // token was persisted, so a refresh left `user` null and the app dropped
  // back to the signed-out view despite holding a valid token.
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(readStoredToken);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = useCallback((userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch {
      /* non-fatal: the session still works for this tab */
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    try {
      localStorage.removeItem(USER_KEY);
    } catch {
      /* non-fatal */
    }
  }, []);

  // Keep tabs consistent: signing out in one tab signs out the others rather
  // than leaving them holding a token that no longer exists.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === TOKEN_KEY && !e.newValue) {
        setUser(null);
        setToken(null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo(
    () => ({ user, token, login, logout, isAuthenticated: Boolean(token) }),
    [user, token, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
