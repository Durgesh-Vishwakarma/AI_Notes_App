import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerRequest, login as loginRequest } from '../api';
import { useAuth } from '../AuthContext';
import Seo from '../components/Seo';
import { Button, Input, Card, Alert, Icon } from '../components/UI';

const MIN_PASSWORD_LENGTH = 8;

// Length carries more weight than character classes, which is roughly how
// real-world password strength works.
const scorePassword = (pw) => {
  if (!pw) return { level: 0, label: '', colour: 'var(--border)' };

  let score = 0;
  if (pw.length >= MIN_PASSWORD_LENGTH) score += 1;
  if (pw.length >= 12) score += 1;
  if (pw.length >= 16) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw) && /[A-Za-z]/.test(pw)) score += 1;

  if (pw.length < MIN_PASSWORD_LENGTH) {
    return { level: 1, label: `Too short — ${MIN_PASSWORD_LENGTH} characters minimum`, colour: 'var(--danger)' };
  }
  if (score <= 2) return { level: 1, label: 'Weak', colour: 'var(--danger)' };
  if (score <= 3) return { level: 2, label: 'Reasonable', colour: 'var(--warning)' };
  return { level: 3, label: 'Strong', colour: 'var(--success)' };
};

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = scorePassword(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Please use at least ${MIN_PASSWORD_LENGTH} characters for your password.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await registerRequest(name, email, password);

      // Previously registration only showed a "now go sign in" message. Signing
      // the user straight in removes a step they would always have taken anyway.
      const res = await loginRequest(email, password);
      login(res.data.user, res.data.token);
      navigate('/app', { replace: true });
    } catch (err) {
      if (!err.response) {
        setError(
          'Could not reach the server. It may be starting up — wait a moment and try again.'
        );
      } else if (err.response.status === 400) {
        setError(err.response.data?.message || 'That email address is already registered.');
      } else {
        setError(err.response.data?.message || 'Could not create your account. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="Create an account"
        description="Create a free AI Notes account to write notes, generate bullet-point summaries, and export to PDF, Markdown or JSON."
        path="/register"
        noindex
      />

      <Card style={{ padding: 32 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 6 }}>Create your account</h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', marginBottom: 28 }}>
          Free, and you can export everything you write at any time.
        </p>

        {error && (
          <div style={{ marginBottom: 20 }}>
            <Alert type="error">{error}</Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Input
            type="text"
            name="name"
            label="Name"
            placeholder="How should we address you?"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<Icon.User />}
            required
          />

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
            placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Icon.Lock />}
            minLength={MIN_PASSWORD_LENGTH}
            required
          />

          {password && (
            <div style={{ marginTop: -12, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 6 }} aria-hidden="true">
                {[1, 2, 3].map((level) => (
                  <span
                    key={level}
                    style={{
                      height: 3,
                      flex: 1,
                      borderRadius: 999,
                      background: level <= strength.level ? strength.colour : 'var(--bg-inset)',
                      transition: 'background-color 150ms',
                    }}
                  />
                ))}
              </div>
              <p
                className="hint"
                style={{ color: strength.colour, marginTop: 0 }}
                role="status"
                aria-live="polite"
              >
                {strength.label}
              </p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Creating account…' : 'Create account'}
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
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </>
  );
}
