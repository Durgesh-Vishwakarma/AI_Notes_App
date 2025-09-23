import React, { useState, useContext } from 'react';
import { login } from './api';
import { AuthContext } from './AuthContext';
import { Button, Input, Card } from './components/UI';

export default function Login() {
  const { login: loginUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      loginUser(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>
      <form onSubmit={handleSubmit}>
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
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          label="Password"
          required
          error={error}
        />
        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          className="w-full"
        >
          Sign In
        </Button>
      </form>
    </Card>
  );
}
