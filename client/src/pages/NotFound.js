import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page not found"
        description="That page does not exist on AI Notes."
        path="/404"
        noindex
      />

      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container-narrow">
          <p
            style={{
              fontSize: '0.8125rem',
              fontWeight: 650,
              letterSpacing: '0.08em',
              color: 'var(--accent)',
              marginBottom: 16,
            }}
          >
            404
          </p>
          <h1 style={{ marginBottom: 16 }}>That page does not exist</h1>
          <p
            style={{
              fontSize: '1.0625rem',
              color: 'var(--text-secondary)',
              maxWidth: '46ch',
              margin: '0 auto 32px',
            }}
          >
            The link may be out of date, or the address may have a typo in it.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-primary btn-lg">
              Go to the home page
            </Link>
            <Link to="/app" className="btn btn-secondary btn-lg">
              Open your notes
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
