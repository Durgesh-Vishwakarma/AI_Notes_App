import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import NoteEditor from './NoteEditor';
import ExportModal from './components/ExportModal';
import { Button, Card, Badge, LoadingSpinner, Toast, EmptyState, ConfirmDialog } from './components/UI';

// Set axios base URL for production
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
axios.defaults.baseURL = API_URL;

export default function NotesDashboard() {
  const { token } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/notes');
      setNotes(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load notes');
    }
    setLoading(false);
  };

  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = {};
      if (search) params.q = search;
      if (tag) params.tag = tag;
      const res = await axios.get('/notes/search', { params });
      setSearchResults(res.data);
      setError('');
      if (res.data.length === 0) {
        setToast({ message: 'No matching notes found.', type: 'info' });
      }
    } catch {
      setError('Search failed');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/notes/${id}`);
      setNotes(notes.filter((n) => n._id !== id));
      setSearchResults(searchResults.filter((n) => n._id !== id));
      setToast({ message: 'Note deleted successfully', type: 'success' });
    } catch {
      setError('Delete failed');
    }
    setConfirmDelete(null);
  };

  const handleEdit = (note) => setEditingNote(note);
  const handleNew = () => setEditingNote({ title: '', content: '', tags: [] });

  const handleSave = async (note) => {
    try {
      if (note._id) {
        const res = await axios.put(`/notes/${note._id}`, note);
        setNotes(notes.map((n) => (n._id === note._id ? res.data : n)));
        setToast({ message: 'Note updated successfully', type: 'success' });
      } else {
        const res = await axios.post('/notes', note);
        setNotes([res.data, ...notes]);
        setToast({ message: 'Note created successfully', type: 'success' });
      }
      setEditingNote(null);
    } catch {
      setError('Save failed');
    }
  };

  // IMPORTANT: Hooks must not be called conditionally. Compute memoized values
  // before any early returns to keep hook order consistent across renders.
  // Collect all tags for filter dropdown (avoid flatMap for broader browser support)
  const allTags = React.useMemo(() => {
    try {
      if (!Array.isArray(notes)) return [];
      const collected = [];
      for (const n of notes) {
        if (n && Array.isArray(n.tags)) {
          for (const t of n.tags) {
            if (typeof t === 'string') collected.push(t);
          }
        }
      }
      const unique = Array.from(new Set(collected)).sort();
      return unique;
    } catch (e) {
      // Debug fallback
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('allTags compute error', e, notes);
      }
      return [];
    }
  }, [notes]);

  // Normalize notes to avoid undefined property access
  const safeNotes = Array.isArray(notes)
    ? notes.map((n) => ({
        ...n,
        tags: Array.isArray(n?.tags) ? n.tags : [],
        summary: Array.isArray(n?.summary) ? n.summary : [],
      }))
    : [];

  if (process.env.NODE_ENV === 'development') {
    // Minimal once-per-render logging to debug error 310 origin (remove after fix)
    // eslint-disable-next-line no-console
    console.debug('NotesDashboard debug:', { count: safeNotes.length, allTags });
  }

  if (loading) return <LoadingSpinner text="Loading your notes..." />;

  const clearSearch = () => {
    setSearchResults([]);
    setSearch('');
    setTag('');
  };

  // Render a single note card (reused for both main list and search results)
  const renderNoteCard = (note, isSearchResult = false) => (
    <div
      key={note._id}
      className={`glass-card note-card p-5 animate-fade-in`}
      style={{
        borderColor: isSearchResult ? 'rgba(99, 102, 241, 0.3)' : undefined,
      }}
    >
      {/* Title */}
      <h3
        className="font-bold text-lg mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        {note.title}
      </h3>

      {/* Content preview */}
      <p
        className="mb-3 text-sm leading-relaxed"
        style={{ color: 'var(--text-secondary)' }}
      >
        {note.content && note.content.length > 200
          ? note.content.substring(0, 200) + '...'
          : note.content}
      </p>

      {/* Tags */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {(Array.isArray(note.tags) ? note.tags : [])
          .filter((t) => typeof t === 'string' && t.trim())
          .map((tag) => (
            <Badge key={tag} variant="primary">
              {tag}
            </Badge>
          ))}
        {!Array.isArray(note.tags) && (
          <span
            className="text-xs"
            style={{ color: 'var(--text-muted)' }}
            title="Tags data missing"
          >
            No tags
          </span>
        )}
      </div>

      {/* AI Summary */}
      {Array.isArray(note.summary) && note.summary.filter(s => typeof s === 'string' && s.trim()).length > 0 && (
        <div
          className="mb-4 p-3 rounded-xl"
          style={{
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
          }}
        >
          <div
            className="text-xs font-semibold mb-2 flex items-center gap-1.5"
            style={{ color: '#a5b4fc' }}
          >
            <span>✨</span> AI Insights
          </div>
          <ul className="space-y-1">
            {note.summary
              .filter((s) => typeof s === 'string' && s.trim())
              .map((s, i) => (
                <li
                  key={i}
                  className="text-xs flex items-start gap-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <span style={{ color: 'var(--accent-purple)' }}>•</span>
                  {s}
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => handleEdit(note)}>
          ✏️ Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() =>
            setConfirmDelete({
              id: note._id,
              title: note.title,
            })
          }
        >
          🗑️ Delete
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto mt-4 w-full px-2 sm:px-4 flex flex-col sm:flex-row gap-8">
      {/* Left column: All notes */}
      <div className="flex-1">
        {/* Action Bar */}
        <div className="mb-5 flex gap-3">
          <Button variant="success" onClick={handleNew} icon="✏️">
            New Note
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowExportModal(true)}
            disabled={safeNotes.length === 0}
            icon="📤"
          >
            Export ({safeNotes.length})
          </Button>
        </div>

        {/* Search Bar */}
        <form
          className="mb-6 flex flex-col sm:flex-row gap-3"
          onSubmit={handleSearch}
        >
          <div className="relative flex-1">
            <div
              className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search your notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-glass pl-11"
            />
          </div>

          {/* Tag Filter as Pills */}
          <div className="flex gap-2 items-center flex-wrap">
            <button
              type="button"
              onClick={() => setTag('')}
              className={`badge transition-all duration-200 cursor-pointer ${tag === '' ? 'badge-primary' : 'badge-default'}`}
              style={{ padding: '6px 14px' }}
            >
              All
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(t)}
                className={`badge transition-all duration-200 cursor-pointer ${tag === t ? 'badge-primary' : 'badge-default'}`}
                style={{ padding: '6px 14px' }}
              >
                {t}
              </button>
            ))}
          </div>

          <Button type="submit" variant="primary" size="md">
            Search
          </Button>
        </form>

        {/* Note Editor */}
        {editingNote && (
          <div className="mb-6 animate-scale-in">
            <NoteEditor
              note={editingNote}
              onSave={handleSave}
              onCancel={() => setEditingNote(null)}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="mb-4 p-3 rounded-xl text-sm"
            style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              color: '#fb7185',
            }}
          >
            ⚠ {error}
          </div>
        )}

        {/* Notes Heading */}
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-xl font-bold gradient-text"
          >
            All Notes
          </h2>
          <span
            className="text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            {safeNotes.length} note{safeNotes.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Notes Grid */}
        {safeNotes.length === 0 ? (
          <EmptyState
            icon="📝"
            title="Your workspace is empty"
            description="Create your first note and let AI do the heavy lifting. Get instant summaries, smart tags, and powerful search — all in one place."
            action={
              <Button variant="primary" size="lg" onClick={handleNew} icon="✨">
                Create Your First Note
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4">
            {safeNotes.map((note) => renderNoteCard(note))}
          </div>
        )}
      </div>

      {/* Right column: Search results */}
      {searchResults.length > 0 && Array.isArray(searchResults) && (
        <div
          className="flex-1 animate-slide-up"
          style={{
            borderLeft: '1px solid rgba(168, 85, 247, 0.15)',
            paddingLeft: '2rem',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold gradient-text-secondary">
              Search Results
            </h2>
            <Button variant="outline" size="sm" onClick={clearSearch}>
              ✕ Clear
            </Button>
          </div>
          <div className="grid gap-4">
            {searchResults
              .filter(Boolean)
              .map((note) => renderNoteCard(note, true))}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm Delete Dialog */}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete Note"
          message={`Are you sure you want to delete "${confirmDelete.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Keep It"
          variant="danger"
          onConfirm={() => handleDelete(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Export Modal */}
      <ExportModal
        notes={safeNotes}
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
}
