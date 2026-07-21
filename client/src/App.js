import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { AuthProvider, useAuth } from './AuthContext';
import { MarketingLayout, AuthLayout, AppLayout } from './components/Layout';

import Landing from './pages/Landing';
import Features from './pages/Features';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NotFound from './pages/NotFound';

/**
 * Client-side routing leaves the scroll position where the previous page left
 * it, which lands you halfway down a page you have not read yet.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

/** Requires a session; remembers where the user was going so login can return them. */
const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

/** Signed-in users have no reason to see the login or register forms. */
const RedirectIfAuthed = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/app" replace /> : children;
};

const AppRoutes = () => (
  <Routes>
    {/* Public, indexable */}
    <Route
      path="/"
      element={
        <MarketingLayout>
          <Landing />
        </MarketingLayout>
      }
    />
    <Route
      path="/features"
      element={
        <MarketingLayout>
          <Features />
        </MarketingLayout>
      }
    />

    {/* Auth forms */}
    <Route
      path="/login"
      element={
        <RedirectIfAuthed>
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        </RedirectIfAuthed>
      }
    />
    <Route
      path="/register"
      element={
        <RedirectIfAuthed>
          <AuthLayout>
            <RegisterPage />
          </AuthLayout>
        </RedirectIfAuthed>
      }
    />

    {/* Authenticated */}
    <Route
      path="/app"
      element={
        <RequireAuth>
          <AppLayout>
            <DashboardPage />
          </AppLayout>
        </RequireAuth>
      }
    />

    <Route
      path="*"
      element={
        <MarketingLayout>
          <NotFound />
        </MarketingLayout>
      }
    />
  </Routes>
);

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <AppRoutes />
    </AuthProvider>
  );
}
