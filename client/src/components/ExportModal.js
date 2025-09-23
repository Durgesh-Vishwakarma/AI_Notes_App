import React, { useState } from 'react';
import { Button } from './UI';
import { exportToPDF, exportToMarkdown, exportToJSON, downloadFile } from '../utils/exportUtils';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Export Notes</h2>
        
        <div className="mb-4">
          <p className="text-gray-600 mb-3">
            Export {notes.length} note{notes.length !== 1 ? 's' : ''} in your preferred format:
          </p>
          
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="pdf"
                checked={exportFormat === 'pdf'}
                onChange={(e) => setExportFormat(e.target.value)}
                className="mr-2"
              />
              <span>PDF - Formatted document with styling</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                value="markdown"
                checked={exportFormat === 'markdown'}
                onChange={(e) => setExportFormat(e.target.value)}
                className="mr-2"
              />
              <span>Markdown - Plain text with markup</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                value="json"
                checked={exportFormat === 'json'}
                onChange={(e) => setExportFormat(e.target.value)}
                className="mr-2"
              />
              <span>JSON - Structured data format</span>
            </label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            loading={loading}
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}