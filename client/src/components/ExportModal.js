import React, { useState } from 'react';
import { Button } from './UI';
import { exportToPDF, exportToMarkdown, exportToJSON, downloadFile } from '../utils/exportUtils';

const formatOptions = [
  {
    id: 'pdf',
    label: 'PDF Document',
    description: 'Formatted document with professional styling',
    icon: '📄',
  },
  {
    id: 'markdown',
    label: 'Markdown',
    description: 'Plain text with lightweight markup syntax',
    icon: '📝',
  },
  {
    id: 'json',
    label: 'JSON Data',
    description: 'Structured data format for developers',
    icon: '{ }',
  },
];

export default function ExportModal({ notes, isOpen, onClose }) {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);

    try {
      const timestamp = new Date().toISOString().split('T')[0];

      switch (exportFormat) {
        case 'pdf':
          exportToPDF(notes, `notes-${timestamp}.pdf`);
          break;
        case 'markdown':
          const markdownContent = exportToMarkdown(notes);
          downloadFile(markdownContent, `notes-${timestamp}.md`, 'text/markdown');
          break;
        case 'json':
          const jsonContent = exportToJSON(notes);
          downloadFile(jsonContent, `notes-${timestamp}.json`, 'application/json');
          break;
        default:
          throw new Error('Invalid export format');
      }

      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="glass p-6 max-w-md w-full mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold gradient-text">Export Notes</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Export {notes.length} note{notes.length !== 1 ? 's' : ''} in your preferred format
          </p>
        </div>

        {/* Format Options as Selectable Cards */}
        <div className="space-y-3 mb-6">
          {formatOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setExportFormat(option.id)}
              className="w-full text-left p-4 rounded-xl transition-all duration-300"
              style={{
                background:
                  exportFormat === option.id
                    ? 'rgba(168, 85, 247, 0.15)'
                    : 'rgba(37, 33, 57, 0.4)',
                border:
                  exportFormat === option.id
                    ? '1px solid rgba(168, 85, 247, 0.4)'
                    : '1px solid rgba(168, 85, 247, 0.08)',
                boxShadow:
                  exportFormat === option.id
                    ? '0 0 15px rgba(168, 85, 247, 0.1)'
                    : 'none',
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <div
                    className="font-semibold text-sm"
                    style={{
                      color:
                        exportFormat === option.id
                          ? 'var(--text-primary)'
                          : 'var(--text-secondary)',
                    }}
                  >
                    {option.label}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {option.description}
                  </div>
                </div>
                {/* Radio indicator */}
                <div className="ml-auto">
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                    style={{
                      borderColor:
                        exportFormat === option.id
                          ? 'var(--accent-purple)'
                          : 'var(--text-muted)',
                    }}
                  >
                    {exportFormat === option.id && (
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: 'var(--accent-purple)' }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            loading={loading}
            icon="📤"
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}