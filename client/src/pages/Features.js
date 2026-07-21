import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

/* A second indexable page. Each block targets a distinct search intent
   ("summarise notes", "search notes by tag", "export notes to markdown")
   rather than repeating the landing page in different words. */

const sections = [
  {
    id: 'summaries',
    heading: 'Note summarisation',
    lead: 'Turn a long note into a few bullet points you can scan.',
    body: [
      'Summarisation runs per note, when you ask for it. Write the note first, then generate a summary from the editor — you get back a short list of bullet points covering the substance of what you wrote.',
      'The summary is saved alongside the note, so it appears on the note card in your dashboard. When you come back to a note weeks later, you read three lines instead of three pages, and open the full text only if the summary tells you it is the note you were after.',
      'This works best on notes with actual substance: meeting minutes, lecture notes, research reading, call transcripts. A two-line shopping list will not benefit from it.',
    ],
  },
  {
    id: 'search',
    heading: 'Search and tag filtering',
    lead: 'Two ways to narrow down a growing pile of notes.',
    body: [
      'Full-text search runs across note titles and bodies. Type a word you remember writing and the matching notes come back in a separate results column, leaving your main list untouched so you do not lose your place.',
      'Tags work alongside search rather than instead of it. Add comma-separated tags while writing — "meetings, q3, budget" — and every tag you have used appears as a filter pill on the dashboard. Click one to narrow the list, combine it with a search term to narrow it further.',
      'There are no folders to maintain, which means there is no filing decision to make when you create a note and no reorganisation to do when your projects change.',
    ],
  },
  {
    id: 'export',
    heading: 'Export and data ownership',
    lead: 'Three formats, one click, no lock-in.',
    body: [
      'You can export every note in your account at any time. PDF produces a formatted document for sharing or printing. Markdown gives you plain text that opens in Obsidian, Notion, VS Code or any other editor. JSON gives you structured data with titles, bodies, tags and summaries intact, ready to script against.',
      'Export is available from the dashboard whenever you have at least one note. Nothing is held back on a paid tier, and there is no export limit.',
    ],
  },
  {
    id: 'accounts',
    heading: 'Accounts and access',
    lead: 'Your notes, tied to your account.',
    body: [
      'Notes are stored per account and require a signed-in session to read or modify. Passwords are hashed before storage, and sessions use a signed token that expires after a day.',
      'AI Notes runs in the browser with nothing to install. Sign in from a laptop, finish a note on a phone, and export from either.',
    ],
  },
];

export default function Features() {
  return (
    <>
      <Seo
        title="Features"
        description="AI Notes features in detail: bullet-point note summarisation, full-text search with tag filtering, and export to PDF, Markdown or JSON."
        path="/features"
      />

      <section className="section" style={{ paddingBottom: 48 }}>
        <div className="container-narrow">
          <h1 style={{ marginBottom: 20 }}>Features</h1>
          <p
            style={{
              fontSize: '1.1875rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
            }}
          >
            What AI Notes does, described in enough detail to tell whether it fits how
            you work.
          </p>
        </div>
      </section>

      <div className="container-narrow" style={{ paddingBottom: 88 }}>
        {sections.map(({ id, heading, lead, body }) => (
          <section
            key={id}
            id={id}
            aria-labelledby={`${id}-heading`}
            style={{
              paddingTop: 40,
              paddingBottom: 40,
              borderTop: '1px solid var(--border)',
            }}
          >
            <h2 id={`${id}-heading`} style={{ fontSize: '1.5rem', marginBottom: 8 }}>
              {heading}
            </h2>
            <p
              style={{
                fontSize: '1.0625rem',
                color: 'var(--accent)',
                marginBottom: 20,
              }}
            >
              {lead}
            </p>
            {body.map((para) => (
              <p
                key={para.slice(0, 32)}
                style={{
                  fontSize: '1rem',
                  color: 'var(--text-secondary)',
                  marginBottom: 16,
                }}
              >
                {para}
              </p>
            ))}
          </section>
        ))}

        <section
          style={{
            paddingTop: 48,
            borderTop: '1px solid var(--border)',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', marginBottom: 16 }}>Try it on one note</h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              maxWidth: '46ch',
              margin: '0 auto 24px',
            }}
          >
            An account takes a few seconds and costs nothing.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Create a free account
          </Link>
        </section>
      </div>
    </>
  );
}
