import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import NoteEditor from './NoteEditor';
import ExportModal from './components/ExportModal';
import { Button, Card, Badge, LoadingSpinner, Toast } from './components/UI';

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

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/notes');
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
      const res = await axios.get('/api/notes/search', { params });
      setSearchResults(res.data);
      setError('');
      if (res.data.length === 0) {
        window.alert('No matching notes found.');
      }
    } catch {
      setError('Search failed');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await axios.delete(`/api/notes/${id}`);
      setNotes(notes.filter(n => n._id !== id));
    } catch {
      setError('Delete failed');
    }
  };

  const handleEdit = (note) => setEditingNote(note);
  const handleNew = () => setEditingNote({ title: '', content: '', tags: [] });

  const handleSave = async (note) => {
    try {
      if (note._id) {
        const res = await axios.put(`/api/notes/${note._id}`, note);
        setNotes(notes.map(n => n._id === note._id ? res.data : n));
      } else {
        const res = await axios.post('/api/notes', note);
        setNotes([res.data, ...notes]);
      }
      setEditingNote(null);
    } catch {
      setError('Save failed');
    }
  };

  if (loading) return <LoadingSpinner text="Loading notes..." />;

  // Collect all tags for filter dropdown (avoid flatMap for broader browser support)
  const allTags = React.useMemo(() => {
    if (!Array.isArray(notes)) return [];
    const collected = [];
    for (const n of notes) {
      if (n && Array.isArray(n.tags)) {
        for (const t of n.tags) {
          if (typeof t === 'string') collected.push(t);
        }
      }
    }
    return Array.from(new Set(collected)).sort();
  }, [notes]);

  return (
    <div className="max-w-5xl mx-auto mt-8 w-full px-2 sm:px-4 flex flex-col sm:flex-row gap-8">
      {/* Left column: All notes */}
      <div className="flex-1">
        <div className="mb-4 flex gap-2">
          <Button variant="success" onClick={handleNew}>New Note</Button>
          <Button 
            variant="secondary" 
            onClick={() => setShowExportModal(true)}
            disabled={notes.length === 0}
          >
            Export Notes ({notes.length})
          </Button>
        </div>
        <form className="mb-4 flex flex-col sm:flex-row gap-2" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="p-2 border rounded w-full sm:w-1/2"
          />
          <select
            value={tag}
            onChange={e => setTag(e.target.value)}
            className="p-2 border rounded w-full sm:w-auto"
          >
            <option value="">All Tags</option>
            {allTags.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <Button type="submit" variant="primary" size="md">Search</Button>
        </form>
        {editingNote && (
          <NoteEditor note={editingNote} onSave={handleSave} onCancel={() => setEditingNote(null)} />
        )}
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <h2 className="text-xl font-bold mb-2">All Notes</h2>
        {notes.length === 0 ? (
          <div>No notes yet.</div>
        ) : (
          notes.map(note => (
            <Card key={note._id} className="p-4 mb-4">
              <div className="font-bold text-lg mb-2">{note.title}</div>
              <div className="mb-3 text-gray-700">{note.content}</div>
              <div className="mb-3 flex flex-wrap gap-1">
                {(Array.isArray(note.tags) ? note.tags : []).filter(t => typeof t === 'string' && t.trim()).map(tag => (
                  <Badge key={tag} variant="primary">{tag}</Badge>
                ))}
                {!Array.isArray(note.tags) && (
                  <span className="text-xs text-gray-400" title="Tags data missing">No tags</span>
                )}
              </div>
              <div className="mb-3">
                <span className="font-semibold">AI Summary:</span>
                <ul className="list-disc ml-6 mt-1">
          {(Array.isArray(note.summary) ? note.summary : []).filter(s => typeof s === 'string' && s.trim()).map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="flex gap-2">
                <Button variant="warning" size="sm" onClick={() => handleEdit(note)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(note._id)}>Delete</Button>
              </div>
            </Card>
          ))
        )}
      </div>
      {/* Right column: Search results */}
      {searchResults.length > 0 && (
        <div className="flex-1 border-l border-gray-300 pl-8">
          <h2 className="text-xl font-bold mb-2">Search Results</h2>
          {searchResults.map(note => (
            <Card key={note._id} className="p-4 mb-4 border-blue-200 bg-blue-50">
              <div className="font-bold text-lg mb-2">{note.title}</div>
              <div className="mb-3 text-gray-700">{note.content}</div>
              <div className="mb-3 flex flex-wrap gap-1">
                {(Array.isArray(note.tags) ? note.tags : []).filter(t => typeof t === 'string' && t.trim()).map(tag => (
                  <Badge key={tag} variant="primary">{tag}</Badge>
                ))}
                {!Array.isArray(note.tags) && (
                  <span className="text-xs text-gray-400" title="Tags data missing">No tags</span>
                )}
              </div>
              <div className="mb-3">
                <span className="font-semibold">AI Summary:</span>
                <ul className="list-disc ml-6 mt-1">
          {(Array.isArray(note.summary) ? note.summary : []).filter(s => typeof s === 'string' && s.trim()).map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="flex gap-2">
                <Button variant="warning" size="sm" onClick={() => handleEdit(note)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(note._id)}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      <ExportModal 
        notes={notes}
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
}
