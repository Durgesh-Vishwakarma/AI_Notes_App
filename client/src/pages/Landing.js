import React from 'react';
import { Link } from 'react-router-dom';
import Seo, { SITE_URL } from '../components/Seo';
import { Icon } from '../components/UI';

/* Copy describes what the app actually does: notes are stored per account,
   summarised into bullet points by a Hugging Face model, filtered by tag and
   full-text search, and exported to PDF, Markdown or JSON. No claim here is
   ahead of the implementation. */

const capabilities = [
  {
    title: 'Bullet-point summaries of long notes',
    body: 'Paste meeting notes, lecture material or research and generate a short bullet summary on demand. The summary is stored with the note, so you read the gist first and the detail only when you need it.',
  },
  {
    title: 'Search across every note you have written',
    body: 'Full-text search runs over titles and body content. Combine it with a tag filter to narrow a few hundred notes down to the handful that matter.',
  },
  {
    title: 'Tags you define, not folders you maintain',
    body: 'Add comma-separated tags as you write. Filter by any tag from the dashboard without moving files or rebuilding a folder tree.',
  },
  {
    title: 'Export to PDF, Markdown or JSON',
    body: 'Take everything with you at any time. PDF for sharing, Markdown for other editors, JSON for scripting against your own data.',
  },
];

const steps = [
  {
    n: '01',
    title: 'Write the note',
    body: 'Title, body, and any tags you want. Word and character counts update as you type.',
  },
  {
    n: '02',
    title: 'Generate a summary',
    body: 'Send the note for summarisation and get a handful of bullet points back covering the main content.',
  },
  {
    n: '03',
    title: 'Find it again later',
    body: 'Search by keyword, filter by tag, or export the whole set when you need it elsewhere.',
  },
];

const faqs = [
  {
    q: 'What does the AI summary actually do?',
    a: 'It condenses the body of a note into a short list of bullet points covering the main content. You trigger it explicitly per note — nothing is sent for summarisation unless you ask for it.',
  },
  {
    q: 'Is AI Notes free to use?',
    a: 'Yes. Creating an account, writing notes, generating summaries and exporting your data are all free.',
  },
  {
    q: 'Can I get my notes out of the app?',
    a: 'Yes. You can export all of your notes to PDF, Markdown or JSON at any point from the dashboard. There is no lock-in.',
  },
  {
    q: 'Do I need to install anything?',
    a: 'No. AI Notes runs in the browser. Sign in from any device and your notes are there.',
  },
];

export default function Landing() {
  // FAQPage structured data makes these questions eligible for rich results,
  // and it is one of the few schema types this app can honestly claim.
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AI Notes',
    url: SITE_URL,
    description:
      'A free web app for writing notes and generating bullet-point summaries of them, with tag filtering, full-text search and export to PDF, Markdown or JSON.',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Any modern web browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  return (
    <>
      <Seo
        title="AI Notes — Write notes, get instant summaries"
        description="A free note-taking app that summarises your notes into bullet points, filters them by tag, searches full text, and exports to PDF, Markdown or JSON."
        path="/"
      >
        <script type="application/ld+json">{JSON.stringify(appSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Seo>

      {/* ---------------------------------------------------------------- HERO */}
      <section className="section" style={{ paddingBottom: 64 }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <p
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 20,
              fontSize: '0.8125rem',
              fontWeight: 550,
              color: 'var(--accent)',
            }}
          >
            <Icon.Sparkle width={14} height={14} />
            Free · No credit card required
          </p>

          <h1 style={{ marginBottom: 20 }}>Write the note. Read the summary.</h1>

          <p
            style={{
              fontSize: '1.1875rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              maxWidth: '54ch',
              margin: '0 auto 32px',
            }}
          >
            AI Notes turns long notes into short bullet summaries, so you can find what
            you wrote without rereading all of it. Tag it, search it, export it whenever
            you want.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link to="/register" className="btn btn-primary btn-lg">
              Create a free account
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- PREVIEW */}
      <section style={{ paddingBottom: 88 }}>
        <div className="container">
          <div
            className="card"
            style={{
              maxWidth: 720,
              margin: '0 auto',
              padding: 24,
              background: 'var(--bg-subtle)',
            }}
            aria-label="Example of a note with its generated summary"
          >
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: 12,
              }}
            >
              Example note
            </p>
            {/* Styled as a heading but rendered as text: this is sample
                content inside an illustration, not part of the page outline,
                and marking it up as <h3> skipped a level before the first h2. */}
            <p
              style={{
                fontSize: '1.125rem',
                fontWeight: 650,
                letterSpacing: '-0.02em',
                marginBottom: 8,
              }}
            >
              Q3 planning session
            </p>
            <p
              style={{
                fontSize: '0.9375rem',
                color: 'var(--text-secondary)',
                marginBottom: 16,
              }}
            >
              Two hours of discussion, four competing priorities, and one decision that
              actually mattered. Eleven hundred words of it…
            </p>

            <div
              style={{
                padding: 16,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }}
            >
              <p
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--accent)',
                  marginBottom: 10,
                }}
              >
                <Icon.Sparkle width={13} height={13} />
                Summary
              </p>
              <ul style={{ listStyle: 'none', display: 'grid', gap: 8 }}>
                {[
                  'Hiring freeze holds until the Q4 budget review.',
                  'Mobile launch moves to November; web ships first.',
                  'Dana owns the migration plan, due end of month.',
                ].map((line) => (
                  <li
                    key={line}
                    style={{
                      display: 'flex',
                      gap: 10,
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span style={{ color: 'var(--accent)' }} aria-hidden="true">
                      —
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
              {['planning', 'q3', 'decisions'].map((t) => (
                <span key={t} className="badge">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- CAPABILITIES */}
      <section
        className="section"
        style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)' }}
        aria-labelledby="capabilities-heading"
      >
        <div className="container">
          <h2 id="capabilities-heading" style={{ marginBottom: 12 }}>
            What you can do with it
          </h2>
          <p
            style={{
              fontSize: '1.0625rem',
              color: 'var(--text-secondary)',
              maxWidth: '58ch',
              marginBottom: 48,
            }}
          >
            Four things, done properly, rather than a long list of half-finished ones.
          </p>

          <div
            style={{
              display: 'grid',
              gap: 20,
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            }}
          >
            {capabilities.map(({ title, body }) => (
              <div key={title} className="card card-interactive" style={{ padding: 24 }}>
                <h3 style={{ marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- HOW IT WORKS */}
      <section className="section" aria-labelledby="how-heading">
        <div className="container">
          <h2 id="how-heading" style={{ marginBottom: 48 }}>
            How it works
          </h2>

          <ol
            style={{
              listStyle: 'none',
              display: 'grid',
              gap: 32,
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            }}
          >
            {steps.map(({ n, title, body }) => (
              <li key={n}>
                <p
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 650,
                    letterSpacing: '0.08em',
                    color: 'var(--accent)',
                    marginBottom: 12,
                  }}
                >
                  {n}
                </p>
                <h3 style={{ marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
                  {body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------------------ FAQ */}
      <section
        className="section"
        style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)' }}
        aria-labelledby="faq-heading"
      >
        <div className="container-narrow">
          <h2 id="faq-heading" style={{ marginBottom: 40 }}>
            Common questions
          </h2>

          <div style={{ display: 'grid', gap: 4 }}>
            {faqs.map(({ q, a }) => (
              <details
                key={q}
                className="card"
                style={{ padding: '16px 20px', background: 'var(--surface)' }}
              >
                <summary
                  style={{
                    cursor: 'pointer',
                    fontWeight: 550,
                    fontSize: '0.9375rem',
                    listStyle: 'revert',
                  }}
                >
                  {q}
                </summary>
                <p
                  style={{
                    marginTop: 12,
                    fontSize: '0.9375rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- CLOSER */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container-narrow">
          <h2 style={{ marginBottom: 16 }}>Start with one note</h2>
          <p
            style={{
              fontSize: '1.0625rem',
              color: 'var(--text-secondary)',
              maxWidth: '48ch',
              margin: '0 auto 32px',
            }}
          >
            Create an account and write something. If it does not save you time, export
            your notes and leave — they are yours either way.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Create a free account
          </Link>
        </div>
      </section>
    </>
  );
}
