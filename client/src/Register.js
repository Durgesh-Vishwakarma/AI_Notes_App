import React, { useState } from 'react';
import { register } from './api';
import { Button, Input, Card } from './components/UI';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Simple password strength
  const getPasswordStrength = () => {
    if (!password) return { level: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { level: 1, label: 'Weak', color: '#f43f5e' };
    if (score <= 3) return { level: 2, label: 'Fair', color: '#f59e0b' };
    return { level: 3, label: 'Strong', color: '#10b981' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      setSuccess('Account created successfully! You can now sign in.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setSuccess('');
    }
    setLoading(false);
  };

  return (
    <Card className="p-8">
      {/* Gradient accent line */}
      <div
        className="h-1 w-16 rounded-full mb-6 mx-auto"
        style={{ background: 'var(--gradient-success)' }}
      />
      <h2
        className="text-2xl font-bold mb-1 text-center"
        style={{ color: 'var(--text-primary)' }}
      >
        Create Your Account
      </h2>
      <p
        className="text-sm text-center mb-8"
        style={{ color: 'var(--text-muted)' }}
      >
        Start organizing your notes with AI-powered summaries
      </p>

      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Full Name"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
          required
        />
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
          placeholder="Create a strong password"
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

        {/* Password Strength Indicator */}
        {password && (
          <div className="mb-5 -mt-3">
            <div className="flex gap-1.5 mb-1">
              {[1, 2, 3].map((level) => (
                <div
                  key={level}
                  className="h-1 flex-1 rounded-full transition-all duration-300"
                  style={{
                    background:
                      level <= strength.level
                        ? strength.color
                        : 'rgba(142, 138, 165, 0.2)',
                  }}
                />
              ))}
            </div>
            <p className="text-xs" style={{ color: strength.color }}>
              {strength.label}
            </p>
          </div>
        )}

        {success && (
          <div
            className="mb-5 p-3 rounded-xl text-sm"
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#34d399',
            }}
          >
            ✓ {success}
          </div>
        )}

        <Button
          type="submit"
          variant="success"
          size="lg"
          className="w-full mt-2"
          loading={loading}
        >
          Create Account
        </Button>
      </form>
    </Card>
  );
}
