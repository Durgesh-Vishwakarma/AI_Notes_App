import React, { useState } from 'react';
import { AuthProvider, AuthContext } from './AuthContext';
import { Button } from './components/UI';

import Login from './Login';
import Register from './Register';
import NotesDashboard from './NotesDashboard';

// Feature highlight cards for landing page
const features = [
  {
    icon: '🧠',
    title: 'AI-Powered Summaries',
    description: 'Get instant, intelligent summaries of your notes powered by advanced AI',
  },
  {
    icon: '🔍',
    title: 'Smart Search',
    description: 'Find any note in seconds with powerful full-text search and tag filtering',
  },
  {
    icon: '📤',
    title: 'Export Anywhere',
    description: 'Download your notes as PDF, Markdown, or JSON — your data, your way',
  },
];

function MainApp() {
  const [showRegister, setShowRegister] = useState(false);
  const { user, logout } = React.useContext(AuthContext);

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <div className="animated-bg" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="pt-10 pb-6 px-4 text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight">
              <span className="gradient-text">✨ AI Notes</span>
            </h1>
            {!user && (
              <p
                className="text-lg max-w-lg mx-auto leading-relaxed"
                style={{ color: 'var(--text-muted)' }}
              >
                Transform your thoughts into organized brilliance.
                <br />
                <span style={{ color: 'var(--text-secondary)' }}>
                  Smart note-taking with AI-powered summaries.
                </span>
              </p>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 flex flex-col items-center px-4 pb-8">
          {!user ? (
            <>
              {/* Auth Forms */}
              <div className="w-full max-w-md animate-slide-up">
                {showRegister ? <Register /> : <Login />}
                <div className="text-center mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowRegister((r) => !r)}
                  >
                    {showRegister
                      ? 'Already have an account? Sign In'
                      : 'New here? Create Account'}
                  </Button>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="w-full max-w-4xl mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 px-4">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className="glass-card p-6 text-center"
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3
                      className="font-bold text-base mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Dashboard */
            <div className="w-full animate-fade-in">
              {/* Welcome Bar */}
              <div className="max-w-5xl mx-auto mb-6 px-2 sm:px-4">
                <div className="glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                      style={{
                        background: 'var(--gradient-primary)',
                        color: 'white',
                      }}
                    >
                      {user.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Welcome back
                      </div>
                      <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {user.name} 👋
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Sign Out
                  </Button>
                </div>
              </div>

              <NotesDashboard />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="py-6 text-center">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} AI Notes — Intelligent note-taking for modern minds.
          </p>
        </footer>
      </div>
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