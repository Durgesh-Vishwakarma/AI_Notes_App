import React, { useState, useContext } from 'react';
import { login } from './api';
import { AuthContext } from './AuthContext';
import { Button, Input, Card } from './components/UI';

export default function Login() {
  const { login: loginUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(email, password);
      loginUser(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  return (
    <Card className="p-8">
      {/* Gradient accent line */}
      <div
        className="h-1 w-16 rounded-full mb-6 mx-auto"
        style={{ background: 'var(--gradient-primary)' }}
      />
      <h2
        className="text-2xl font-bold mb-1 text-center"
        style={{ color: 'var(--text-primary)' }}
      >
        Welcome Back
      </h2>
      <p
        className="text-sm text-center mb-8"
        style={{ color: 'var(--text-muted)' }}
      >
        Sign in to access your intelligent notes
      </p>

      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email Address"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          }
          required
        />
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          }
          required
          error={error}
        />
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          loading={loading}
        >
          Sign In
        </Button>
      </form>
    </Card>
  );
}
