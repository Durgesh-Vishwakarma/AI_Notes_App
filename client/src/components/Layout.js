import React, { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Button, Icon } from './UI';

/**
 * Sets the document surface ("light" marketing vs "app" dark) for as long as
 * the component is mounted. Driving this off a data attribute on <html> keeps
 * the token switch in CSS instead of scattering theme branches through JSX.
 */
const useSurface = (surface) => {
  useEffect(() => {
    const root = document.documentElement;
    if (surface === 'app') root.setAttribute('data-surface', 'app');
    else root.removeAttribute('data-surface');

    // Keep the browser chrome in step with the surface
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', surface === 'app' ? '#16161a' : '#ffffff');

    return () => root.removeAttribute('data-surface');
  }, [surface]);
};

const Wordmark = () => (
  <Link
    to="/"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      color: 'var(--text)',
      fontWeight: 650,
      fontSize: '0.9375rem',
      letterSpacing: '-0.02em',
      textDecoration: 'none',
    }}
  >
    <span style={{ color: 'var(--accent)', display: 'flex' }}>
      <Icon.Logo width={22} height={22} />
    </span>
    AI Notes
  </Link>
);

const navLinkStyle = ({ isActive }) => ({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: isActive ? 'var(--text)' : 'var(--text-secondary)',
  textDecoration: 'none',
});

/* ==========================================================================
   MARKETING LAYOUT — light surface, public pages
   ========================================================================== */

export const MarketingLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  useSurface('light');

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'saturate(180%) blur(8px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          className="container"
          style={{
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <Wordmark />

          <nav aria-label="Main" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <NavLink to="/features" style={navLinkStyle} className="hidden sm:inline">
              Features
            </NavLink>
            {isAuthenticated ? (
              <Link to="/app" className="btn btn-primary btn-sm">
                Open app
              </Link>
            ) : (
              <>
                <NavLink to="/login" style={navLinkStyle}>
                  Sign in
                </NavLink>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main id="main">{children}</main>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 0' }}>
        <div
          className="container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} AI Notes
          </p>
          <nav
            aria-label="Footer"
            style={{ display: 'flex', gap: 20, fontSize: '0.8125rem' }}
          >
            <Link to="/features" style={{ color: 'var(--text-muted)' }}>
              Features
            </Link>
            <Link to="/login" style={{ color: 'var(--text-muted)' }}>
              Sign in
            </Link>
            <Link to="/register" style={{ color: 'var(--text-muted)' }}>
              Create account
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
};

/* ==========================================================================
   AUTH LAYOUT — light surface, centred single-column form
   ========================================================================== */

export const AuthLayout = ({ children }) => {
  useSurface('light');

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-subtle)',
        }}
      >
        <header style={{ padding: '20px 0' }}>
          <div className="container">
            <Wordmark />
          </div>
        </header>

        <main
          id="main"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 20px 64px',
          }}
        >
          <div style={{ width: '100%', maxWidth: 400 }}>{children}</div>
        </main>
      </div>
    </>
  );
};

/* ==========================================================================
   APP LAYOUT — dark surface, authenticated
   ========================================================================== */

export const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  useSurface('app');

  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 40,
            background: 'var(--bg)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div
            className="container"
            style={{
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <Wordmark />

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                aria-hidden="true"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  color: 'var(--on-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                }}
              >
                {initial}
              </div>
              <span
                style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}
                className="hidden sm:inline"
              >
                {user?.name}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Sign out
              </Button>
            </div>
          </div>
        </header>

        <main id="main" style={{ flex: 1, padding: '32px 0 64px' }}>
          {children}
        </main>
      </div>
    </>
  );
};
