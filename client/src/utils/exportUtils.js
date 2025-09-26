import { jsPDF } from 'jspdf';

export const exportToPDF = (notes, filename = 'notes-export.pdf') => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('My Notes Export', 20, 20);
  
  // Add export date
  doc.setFontSize(12);
  doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 20, 30);
  
  let yPosition = 50;
  
  notes.forEach((note, index) => {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Note title
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(note.title, 20, yPosition);
    yPosition += 10;
    
    // Note metadata
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Created: ${new Date(note.createdAt).toLocaleDateString()}`, 20, yPosition);
    doc.text(`Tags: ${Array.isArray(note.tags) ? note.tags.join(', ') : ''}`, 120, yPosition);
    yPosition += 10;
    
    // Note content
    doc.setFontSize(12);
    const splitContent = doc.splitTextToSize(note.content, 170);
    doc.text(splitContent, 20, yPosition);
    yPosition += splitContent.length * 6;
    
    // AI Summary
    if (note.summary && note.summary.length > 0) {
      yPosition += 5;
      doc.setFont(undefined, 'bold');
      doc.text('AI Summary:', 20, yPosition);
      yPosition += 7;
      doc.setFont(undefined, 'normal');
      
      note.summary.forEach(point => {
        const splitSummary = doc.splitTextToSize(`• ${point}`, 170);
        doc.text(splitSummary, 25, yPosition);
        yPosition += splitSummary.length * 6;
      });
    }
    
    yPosition += 15; // Space between notes
  });
  
  doc.save(filename);
};

export const exportToMarkdown = (notes) => {
  let markdown = `# My Notes Export\\n\\n`;
  markdown += `*Exported on: ${new Date().toLocaleDateString()}*\\n\\n`;
  
  notes.forEach(note => {
    markdown += `## ${note.title}\\n\\n`;
    markdown += `**Created:** ${new Date(note.createdAt).toLocaleDateString()}\\n`;
    markdown += `**Tags:** ${Array.isArray(note.tags) ? note.tags.join(', ') : ''}\\n\\n`;
    markdown += `${note.content}\\n\\n`;
    
    if (note.summary && note.summary.length > 0) {
      markdown += `### AI Summary\\n\\n`;
      note.summary.forEach(point => {
        markdown += `- ${point}\\n`;
      });
      markdown += `\\n`;
    }
    
    markdown += `---\\n\\n`;
  });
  
  return markdown;
};

export const exportToJSON = (notes) => {
  const exportData = {
    exportDate: new Date().toISOString(),
    notesCount: notes.length,
    notes: notes.map(note => ({
      id: note._id,
      title: note.title,
      content: note.content,
      tags: note.tags,
      summary: note.summary,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt
    }))
  };
  
  return JSON.stringify(exportData, null, 2);
};

export const downloadFile = (content, filename, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};