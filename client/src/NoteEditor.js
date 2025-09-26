import React, { useState } from 'react';
import axios from 'axios';
import { Button, Input, Card } from './components/UI';

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

  const handleSummarize = async () => {
    setSummarizing(true);
    try {
      const res = await axios.post('/notes/summarize', { content });
      setSummary(res.data.summary || []);
      alert('Summarization successful!');
    } catch (err) {
      alert('Summarization failed: ' + (err?.response?.data?.message || err?.message || 'Unknown error'));
    }
    setSummarizing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ ...note, title, content, tags: tags.split(',').map(t => t.trim()).filter(Boolean), summary });
      alert('Note saved successfully!');
    } catch (err) {
      alert('Save failed: ' + (err?.message || 'Unknown error'));
    }
    setSaving(false);
  };

  return (
    <Card className="p-4 mb-4 bg-gray-50">
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          label="Note Title"
          required
        />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            placeholder="Write your note content here..."
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            rows={6}
            required
          />
        </div>
        <Input
          type="text"
          placeholder="Enter tags separated by commas"
          value={tags}
          onChange={e => setTags(e.target.value)}
          label="Tags (comma separated)"
        />
        <div className="flex gap-3 mb-4">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={handleSummarize} 
            loading={summarizing}
          >
            {summarizing ? 'Summarizing...' : 'Generate AI Summary'}
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            loading={saving}
          >
            {saving ? 'Saving...' : 'Save Note'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
        {summary.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="font-semibold text-blue-800 mb-2">AI Summary:</div>
            <ul className="list-disc ml-6 space-y-1">
              {summary.map((s, i) => <li key={i} className="text-blue-700">{s}</li>)}
            </ul>
          </div>
        )}
      </form>
    </Card>
  );
}
