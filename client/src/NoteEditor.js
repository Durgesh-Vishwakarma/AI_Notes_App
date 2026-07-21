import React, { useState } from 'react';
import axios from 'axios';
import { Button, Input, Textarea, Card, Badge, Alert, Icon } from './components/UI';

if (!axios.defaults.baseURL) {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
}

export default function NoteEditor({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note.title || '');
  const [content, setContent] = useState(note.content || '');
  const [tagInput, setTagInput] = useState(
    Array.isArray(note.tags) ? note.tags.join(', ') : ''
  );
  const [summary, setSummary] = useState(Array.isArray(note.summary) ? note.summary : []);
  const [summarising, setSummarising] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const isNew = !note._id;

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;

  const tags = tagInput
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  // Summarising a very short note wastes a request and returns nothing useful
  const canSummarise = words >= 30;

  const handleSummarise = async () => {
    setSummarising(true);
    setMessage(null);

    try {
      const res = await axios.post('/notes/summarize', { content });
      const next = Array.isArray(res.data.summary) ? res.data.summary : [];

      if (next.length === 0) {
        setMessage({ type: 'warning', text: 'The summariser returned nothing for this note.' });
      } else {
        setSummary(next);
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: !err.response
          ? 'Could not reach the summariser. The server may be starting up.'
          : err.response.data?.message || 'Summarising failed. Please try again.',
      });
    }

    setSummarising(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await onSave({ ...note, title, content, tags, summary });
    } catch {
      setMessage({ type: 'error', text: 'Could not save the note. Please try again.' });
      setSaving(false);
    }
  };

  return (
    <Card style={{ padding: 24 }}>
      <h2 style={{ fontSize: '1.125rem', marginBottom: 20 }}>
        {isNew ? 'New note' : 'Edit note'}
      </h2>

      {message && (
        <div style={{ marginBottom: 20 }}>
          <Alert type={message.type}>{message.text}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          label="Title"
          placeholder="What is this note about?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Textarea
          label="Content"
          placeholder="Write your note here…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          hint={`${words} word${words === 1 ? '' : 's'}${
            canSummarise ? '' : ' · about 30 words needed before summarising'
          }`}
          required
        />

        <Input
          type="text"
          label="Tags"
          placeholder="meetings, q3, budget"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          hint="Separate tags with commas. These become filters on your dashboard."
        />

        {tags.length > 0 && (
          <div
            style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: -12, marginBottom: 20 }}
          >
            {tags.map((tag) => (
              <Badge key={tag} variant="accent">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {summary.length > 0 && (
          <div className="panel" style={{ padding: 16, marginBottom: 20 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 10,
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
                }}
              >
                <Icon.Sparkle width={13} height={13} />
                Summary
              </p>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setSummary([])}
              >
                Remove
              </button>
            </div>
            <ul style={{ listStyle: 'none', display: 'grid', gap: 8 }}>
              {summary.map((line, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 8,
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span aria-hidden="true" style={{ color: 'var(--text-muted)' }}>
                    —
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            paddingTop: 4,
            borderTop: '1px solid var(--border)',
            marginTop: 4,
          }}
        >
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <Button type="submit" variant="primary" loading={saving}>
              {saving ? 'Saving…' : 'Save note'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              icon={<Icon.Sparkle />}
              onClick={handleSummarise}
              loading={summarising}
              disabled={!canSummarise}
              title={canSummarise ? undefined : 'Write a little more first'}
            >
              {summarising ? 'Summarising…' : summary.length ? 'Regenerate summary' : 'Summarise'}
            </Button>
          </div>
          <div style={{ marginLeft: 'auto', marginTop: 16 }}>
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
