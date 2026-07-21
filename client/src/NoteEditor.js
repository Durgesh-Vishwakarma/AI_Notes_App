import React, { useState } from 'react';
import axios from 'axios';
import { Button, Input, Card, Badge, Toast } from './components/UI';

// Ensure axios base URL is set (in case NoteEditor is used independently)
if (!axios.defaults.baseURL) {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  axios.defaults.baseURL = API_URL;
}

export default function NoteEditor({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note.title || '');
  const [content, setContent] = useState(note.content || '');
  const [tags, setTags] = useState(note.tags ? note.tags.join(', ') : '');
  const [summary, setSummary] = useState(note.summary || []);
  const [summarizing, setSummarizing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  const parsedTags = tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const handleSummarize = async () => {
    if (!content.trim()) {
      setToast({ message: 'Please add some content before summarizing.', type: 'warning' });
      return;
    }

    setSummarizing(true);
    try {
      const res = await axios.post('/notes/summarize', { content });
      setSummary(res.data.summary || []);
      setToast({ message: 'AI summary generated successfully!', type: 'success' });
    } catch (err) {
      console.error('Summarization error:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Unknown error';
      const statusCode = err?.response?.status || 'Unknown';
      setToast({ message: `Summarization failed (${statusCode}): ${errorMessage}`, type: 'error' });
    }
    setSummarizing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        ...note,
        title,
        content,
        tags: parsedTags,
        summary,
      });
    } catch (err) {
      setToast({ message: 'Save failed: ' + (err?.message || 'Unknown error'), type: 'error' });
    }
    setSaving(false);
  };

  return (
    <Card className="p-6 relative overflow-hidden" hover={false}>
      {/* Gradient accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: 'var(--gradient-secondary)' }}
      />

      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Give your note a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="Note Title"
          required
        />

        {/* Content Textarea */}
        <div className="mb-5">
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Content
          </label>
          <textarea
            placeholder="Write your thoughts here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input-glass"
            style={{ minHeight: '160px', resize: 'vertical', lineHeight: '1.7' }}
            required
          />
          {/* Word & Char Count */}
          <div
            className="flex justify-end gap-4 mt-2 text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            <span>{wordCount} words</span>
            <span>{charCount} chars</span>
          </div>
        </div>

        {/* Tags Input */}
        <Input
          type="text"
          placeholder="productivity, ideas, ai (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          label="Tags"
        />

        {/* Tag Preview Pills */}
        {parsedTags.length > 0 && (
          <div className="mb-5 -mt-3 flex flex-wrap gap-1.5">
            {parsedTags.map((tag) => (
              <Badge key={tag} variant="primary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleSummarize}
            loading={summarizing}
            icon="✨"
          >
            {summarizing ? 'Generating...' : 'Generate AI Insights'}
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            icon="💾"
          >
            {saving ? 'Saving...' : 'Save Note'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>

        {/* AI Summary Display */}
        {summary.length > 0 && (
          <div
            className="mt-4 p-4 rounded-xl animate-fade-in"
            style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
            }}
          >
            <div
              className="font-semibold text-sm mb-3 flex items-center gap-2"
              style={{ color: '#a5b4fc' }}
            >
              <span>✨</span> AI Insights
            </div>
            <ul className="space-y-2">
              {summary.map((s, i) => (
                <li
                  key={i}
                  className="text-sm flex items-start gap-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <span style={{ color: 'var(--accent-purple)', marginTop: '2px' }}>•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </Card>
  );
}
