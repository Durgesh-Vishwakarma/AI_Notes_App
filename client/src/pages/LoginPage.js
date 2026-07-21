import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login as loginRequest } from '../api';
import { useAuth } from '../AuthContext';
import Seo from '../components/Seo';
import { Button, Input, Card, Alert, Icon } from '../components/UI';

export default function LoginPage() {
  const { login, sessionExpired } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Send the user back where they were headed before the redirect to /login
  const from = location.state?.from?.pathname || '/app';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await loginRequest(email, password);
      login(res.data.user, res.data.token);
      navigate(from, { replace: true });
    } catch (err) {
      // Distinguish "server unreachable" from "wrong password" — the generic
      // message previously shown sent people hunting for a typo during outages.
      if (!err.response) {
        setError(
          'Could not reach the server. It may be starting up — wait a moment and try again.'
        );
      } else if (err.response.status === 400 || err.response.status === 401) {
        setError('That email and password combination did not match an account.');
      } else {
        setError(err.response.data?.message || 'Sign in failed. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="Sign in"
        description="Sign in to your AI Notes account to read, write and summarise your notes."
        path="/login"
        noindex
      />

      <Card style={{ padding: 32 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 6 }}>Sign in</h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', marginBottom: 28 }}>
          Welcome back. Your notes are where you left them.
        </p>

        {sessionExpired && !error && (
          <div style={{ marginBottom: 20 }}>
            <Alert type="info">Your session expired. Please sign in again.</Alert>
          </div>
        )}

        {error && (
          <div style={{ marginBottom: 20 }}>
            <Alert type="error">{error}</Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Input
            type="email"
            name="email"
            label="Email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Icon.Mail />}
            required
          />

          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Your password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Icon.Lock />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
            style={{ width: '100%' }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </Card>

      <p
        style={{
          textAlign: 'center',
          marginTop: 20,
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
        }}
      >
        Don&apos;t have an account? <Link to="/register">Create one free</Link>
      </p>
    </>
  );
}
