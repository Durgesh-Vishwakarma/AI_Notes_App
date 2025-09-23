import React, { useState } from 'react';
import { AuthProvider, AuthContext } from './AuthContext';
import { Button } from './components/UI';

import Login from './Login';
import Register from './Register';
import NotesDashboard from './NotesDashboard';


function MainApp() {
  const [showRegister, setShowRegister] = useState(false);
  const { user, logout } = React.useContext(AuthContext);

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 flex flex-col items-center justify-center">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          🤖 AI Notes App
        </h1>
        <p className="text-gray-600 text-center">Smart note-taking with AI-powered summaries</p>
      </div>
      {!user ? (
        <div className="w-full max-w-md">
          {showRegister ? <Register /> : <Login />}
          <div className="text-center mt-6">
            <Button
              variant="outline"
              onClick={() => setShowRegister(r => !r)}
            >
              {showRegister ? 'Already have an account? Sign In' : 'New here? Create Account'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="max-w-md mx-auto mb-6 text-center">
            <div className="mb-4 text-lg">Welcome back, <span className="font-semibold text-blue-600">{user.name}</span>! 👋</div>
            <Button variant="danger" onClick={logout}>Sign Out</Button>
          </div>
          <NotesDashboard />
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;