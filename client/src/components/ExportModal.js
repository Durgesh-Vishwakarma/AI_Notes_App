import React, { useState, useId } from 'react';
import { Button, Modal, Alert } from './UI';
import { exportToPDF, exportToMarkdown, exportToJSON, downloadFile } from '../utils/exportUtils';

const formats = [
  {
    id: 'pdf',
    label: 'PDF',
    description: 'A formatted document for reading, printing or sharing.',
  },
  {
    id: 'markdown',
    label: 'Markdown',
    description: 'Plain text that opens in Obsidian, Notion, VS Code and most editors.',
  },
  {
    id: 'json',
    label: 'JSON',
    description: 'Structured data with titles, content, tags and summaries intact.',
  },
];

export default function ExportModal({ notes, onClose }) {
  const [format, setFormat] = useState('pdf');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const groupId = useId();

  const handleExport = async () => {
    setLoading(true);
    setError('');

    try {
      const stamp = new Date().toISOString().split('T')[0];

      if (format === 'pdf') {
        exportToPDF(notes, `notes-${stamp}.pdf`);
      } else if (format === 'markdown') {
        downloadFile(exportToMarkdown(notes), `notes-${stamp}.md`, 'text/markdown');
      } else {
        downloadFile(exportToJSON(notes), `notes-${stamp}.json`, 'application/json');
      }

      onClose();
    } catch (err) {
      // Previously this called window.alert(), which is dismissed outside the
      // dialog and gives no way to retry a different format.
      setError('The export could not be generated. Try a different format.');
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Export notes"
      description={`${notes.length} note${notes.length === 1 ? '' : 's'} will be included.`}
      onClose={onClose}
    >
      <div style={{ padding: '16px 20px 20px' }}>
        {error && (
          <div style={{ marginBottom: 16 }}>
            <Alert type="error">{error}</Alert>
          </div>
        )}

        <fieldset style={{ border: 0, marginBottom: 20 }}>
          <legend className="sr-only">Choose an export format</legend>

          <div style={{ display: 'grid', gap: 8 }}>
            {formats.map((option) => {
              const selected = format === option.id;
              const inputId = `${groupId}-${option.id}`;

              return (
                <label
                  key={option.id}
                  htmlFor={inputId}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: 14,
                    cursor: 'pointer',
                    borderRadius: 'var(--radius)',
                    background: selected ? 'var(--accent-subtle)' : 'var(--bg-subtle)',
                    border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                    transition: 'background-color 150ms, border-color 150ms',
                  }}
                >
                  <input
                    id={inputId}
                    type="radio"
                    name={groupId}
                    value={option.id}
                    checked={selected}
                    onChange={() => setFormat(option.id)}
                    style={{ marginTop: 3, accentColor: 'var(--accent)' }}
                  />
                  <span>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.9375rem',
                        fontWeight: 550,
                        color: 'var(--text)',
                        marginBottom: 2,
                      }}
                    >
                      {option.label}
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {option.description}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleExport} loading={loading}>
            {loading ? 'Preparing…' : 'Download'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
