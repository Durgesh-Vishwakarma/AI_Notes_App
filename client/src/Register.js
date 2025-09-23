import React, { useState } from 'react';
import { register } from './api';
import { Button, Input, Card } from './components/UI';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      setSuccess('Registration successful! You can now log in.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setSuccess('');
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={e => setName(e.target.value)}
          label="Full Name"
          required
        />
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          label="Email Address"
          required
        />
        <Input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          label="Password"
          required
          error={error}
        />
        {success && <div className="text-green-600 mb-4 p-3 bg-green-50 border border-green-200 rounded">{success}</div>}
        <Button 
          type="submit" 
          variant="success" 
          size="lg" 
          className="w-full"
        >
          Create Account
        </Button>
      </form>
    </Card>
  );
}
