import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import NoteEditor from './NoteEditor';
import ExportModal from './components/ExportModal';
import {
  Button,
  Badge,
  Alert,
  Toast,
  EmptyState,
  ConfirmDialog,
  SkeletonList,
  Icon,
} from './components/UI';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
axios.defaults.baseURL = API_URL;

/* -------------------------------------------------------------------------
   NOTE CARD
   ------------------------------------------------------------------------- */

const NoteCard = ({ note, onEdit, onDelete }) => {
  const tags = note.tags.filter((t) => typeof t === 'string' && t.trim());
  const summary = note.summary.filter((s) => typeof s === 'string' && s.trim());

  const preview =
    note.content && note.content.length > 240
      ? `${note.content.slice(0, 240).trimEnd()}…`
      : note.content;

  return (
    <article className="card card-interactive" style={{ padding: 20 }}>
      <h3 style={{ marginBottom: 6 }}>{note.title || 'Untitled note'}</h3>

      {preview && (
        <p
          style={{
            fontSize: '0.9375rem',
            color: 'var(--text-secondary)',
            marginBottom: 14,
            whiteSpace: 'pre-wrap',
          }}
        >
          {preview}
        </p>
      )}

      {summary.length > 0 && (
        <div className="panel" style={{ padding: 14, marginBottom: 14 }}>
          <p
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--accent)',
              marginBottom: 8,
            }}
          >
            <Icon.Sparkle width={13} height={13} />
            Summary
          </p>
          <ul style={{ listStyle: 'none', display: 'grid', gap: 6 }}>
            {summary.map((line, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  gap: 8,
                  fontSize: '0.8125rem',
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

      {tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="secondary" size="sm" icon={<Icon.Pencil />} onClick={() => onEdit(note)}>
          Edit
        </Button>
        <Button variant="danger" size="sm" icon={<Icon.Trash />} onClick={() => onDelete(note)}>
          Delete
        </Button>
      </div>
    </article>
  );
};

/* -------------------------------------------------------------------------
   DASHBOARD
   ------------------------------------------------------------------------- */

export default function NotesDashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [showExport, setShowExport] = useState(false);
  const [toast, setToast] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/notes');
      setNotes(Array.isArray(res.data) ? res.data : []);
      setError('');
    } catch (err) {
      // A 401 is handled globally by the axios interceptor, which drops the
      // session and bounces to /login — showing an error here as well would
      // flash a misleading message on the way out.
      if (err.response?.status !== 401) {
        setError(
          !err.response
            ? 'Could not reach the server. Free-tier hosting sleeps when idle, so the first request after a while can take up to a minute.'
            : 'Could not load your notes. Please refresh to try again.'
        );
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Normalise once, so nothing downstream has to defend against a missing
  // tags/summary array on a note that predates those fields.
  const safeNotes = useMemo(
    () =>
      (Array.isArray(notes) ? notes : []).filter(Boolean).map((n) => ({
        ...n,
        tags: Array.isArray(n.tags) ? n.tags : [],
        summary: Array.isArray(n.summary) ? n.summary : [],
      })),
    [notes]
  );

  const allTags = useMemo(() => {
    const seen = new Set();
    safeNotes.forEach((n) =>
      n.tags.forEach((t) => {
        if (typeof t === 'string' && t.trim()) seen.add(t);
      })
    );
    return Array.from(seen).sort();
  }, [safeNotes]);

  // Filtering is client-side and instant. The previous version required
  // submitting a form to /notes/search and rendered hits in a second column,
  // so the same note could appear twice on screen at once.
  const visibleNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    return safeNotes.filter((n) => {
      if (activeTag && !n.tags.includes(activeTag)) return false;
      if (!q) return true;
      return (
        (n.title || '').toLowerCase().includes(q) || (n.content || '').toLowerCase().includes(q)
      );
    });
  }, [safeNotes, search, activeTag]);

  const handleSave = async (note) => {
    try {
      if (note._id) {
        const res = await axios.put(`/notes/${note._id}`, note);
        setNotes((prev) => prev.map((n) => (n._id === note._id ? res.data : n)));
        setToast({ message: 'Note updated', type: 'success' });
      } else {
        const res = await axios.post('/notes', note);
        setNotes((prev) => [res.data, ...prev]);
        setToast({ message: 'Note created', type: 'success' });
      }
      setEditingNote(null);
      setError('');
    } catch {
      setToast({ message: 'Could not save the note. Please try again.', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    setPendingDelete(null);
    try {
      await axios.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      setToast({ message: 'Note deleted', type: 'success' });
    } catch {
      setToast({ message: 'Could not delete the note. Please try again.', type: 'error' });
    }
  };

  const isFiltering = Boolean(search.trim() || activeTag);

  const clearFilters = () => {
    setSearch('');
    setActiveTag('');
  };

  const startNewNote = () => setEditingNote({ title: '', content: '', tags: [] });

  return (
    <div className="container">
      {/* ------------------------------------------------------------ HEADER */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: 4 }}>Your notes</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {loading ? 'Loading…' : `${safeNotes.length} note${safeNotes.length === 1 ? '' : 's'}`}
            {isFiltering && !loading && ` · ${visibleNotes.length} shown`}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            variant="secondary"
            icon={<Icon.Download />}
            onClick={() => setShowExport(true)}
            disabled={safeNotes.length === 0}
          >
            Export
          </Button>
          <Button variant="primary" icon={<Icon.Plus />} onClick={startNewNote}>
            New note
          </Button>
        </div>
      </div>

      {/* ------------------------------------------------------------ EDITOR */}
      {editingNote && (
        <div style={{ marginBottom: 24 }} className="animate-slide-in">
          <NoteEditor
            key={editingNote._id || 'new'}
            note={editingNote}
            onSave={handleSave}
            onCancel={() => setEditingNote(null)}
          />
        </div>
      )}

      {/* ----------------------------------------------------------- FILTERS */}
      {(safeNotes.length > 0 || isFiltering) && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ position: 'relative', marginBottom: allTags.length ? 12 : 0 }}>
            <span className="field-icon">
              <Icon.Search />
            </span>
            <label htmlFor="note-search" className="sr-only">
              Search notes
            </label>
            <input
              id="note-search"
              type="search"
              className="input input-with-icon"
              placeholder="Search titles and content…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {allTags.length > 0 && (
            <div
              style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}
              role="group"
              aria-label="Filter by tag"
            >
              <button
                type="button"
                className="badge tag-filter"
                aria-pressed={activeTag === ''}
                onClick={() => setActiveTag('')}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="badge tag-filter"
                  aria-pressed={activeTag === tag}
                  onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- ERROR */}
      {error && (
        <div style={{ marginBottom: 20 }}>
          <Alert type="error">
            <span>
              {error}{' '}
              <button
                type="button"
                onClick={fetchNotes}
                style={{
                  background: 'none',
                  border: 0,
                  padding: 0,
                  color: 'inherit',
                  font: 'inherit',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                Try again
              </button>
            </span>
          </Alert>
        </div>
      )}

      {/* -------------------------------------------------------------- LIST */}
      {loading ? (
        <SkeletonList count={3} />
      ) : safeNotes.length === 0 ? (
        <EmptyState
          title="No notes yet"
          description="Write your first note, then generate a summary of it. Meeting notes and reading notes are a good place to start."
          action={
            <Button variant="primary" size="lg" icon={<Icon.Plus />} onClick={startNewNote}>
              Write your first note
            </Button>
          }
        />
      ) : visibleNotes.length === 0 ? (
        <EmptyState
          title="No notes match those filters"
          description={
            activeTag && search.trim()
              ? `Nothing tagged “${activeTag}” contains “${search.trim()}”.`
              : activeTag
                ? `You have no notes tagged “${activeTag}”.`
                : `Nothing contains “${search.trim()}”.`
          }
          action={
            <Button variant="secondary" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          }}
        >
          {visibleNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={setEditingNote}
              onDelete={(n) => setPendingDelete({ id: n._id, title: n.title })}
            />
          ))}
        </div>
      )}

      {/* ----------------------------------------------------------- DIALOGS */}
      {pendingDelete && (
        <ConfirmDialog
          title="Delete this note?"
          message={`“${pendingDelete.title || 'Untitled note'}” will be permanently removed. This cannot be undone.`}
          confirmText="Delete note"
          cancelText="Keep it"
          onConfirm={() => handleDelete(pendingDelete.id)}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {showExport && <ExportModal notes={safeNotes} onClose={() => setShowExport(false)} />}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
