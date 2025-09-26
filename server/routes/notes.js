import express from 'express';
import Note from '../models/Note.js';
import auth from '../middleware/auth.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();


const router = express.Router();

// Summarize endpoint for frontend
router.post('/summarize', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const summary = await getSummary(content);
    res.json({ summary });
  } catch (err) {
    console.error('Summarization error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create Note with AI summary
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const note = new Note({ user: req.user, title, content, tags });
    await note.save();
    // Summarize with OpenAI
    const summary = await getSummary(content);
    note.summary = summary;
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error('Note creation error:', err);
    if (err.response) {
      console.error('OpenAI response error:', err.response.data);
    }
    res.status(500).json({ message: err.message, details: err.response?.data });
  }
});

// Get all notes for user
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Edit note
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { title, content, tags, updatedAt: Date.now() },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    // Re-summarize
    note.summary = await getSummary(content);
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search notes
router.get('/search', auth, async (req, res) => {
  try {
    const { q, tag } = req.query;
    // If no query or tag, return empty array
    // If no query or tag, return empty array (prevents returning all notes)
    if (!q && !tag) {
      return res.json([]);
    }
    // If query is empty string, also return empty array
    if ((q !== undefined && q.trim() === '') && !tag) {
      return res.json([]);
    }
    const query = { user: req.user };
    if (q) query.title = { $regex: q, $options: 'i' };
    if (tag) query.tags = tag;
    const notes = await Note.find(query);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helper: Hugging Face summarization (free tier)
async function getSummary(content) {
  try {
    // For longer content, chunk it to get more comprehensive summaries
    const chunks = chunkContent(content, 500); // 500 words per chunk
    const summaries = [];
    
    for (const chunk of chunks) {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
        {
          inputs: chunk,
          parameters: {
            max_length: 150,
            min_length: 30,
            do_sample: false
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.HF_API_KEY ? { 'Authorization': `Bearer ${process.env.HF_API_KEY}` } : {})
          }
        }
      );
      
      const summary = response.data[0]?.summary_text || '';
      if (summary) {
        summaries.push(summary);
      }
    }
    
    if (summaries.length === 0) {
      return ['AI summary unavailable.'];
    }
    
    // Combine and split summaries into bullet points
    const combinedSummary = summaries.join(' ');
    return combinedSummary
      .split(/\.\s+/)
      .filter(line => line.trim() && line.length > 10)
      .map(line => line.trim().replace(/\.$/, ''))
      .slice(0, 8); // Limit to 8 bullet points max
      
  } catch (err) {
    console.error('Hugging Face API error:', err.response?.data || err.message);
    return ['AI summary unavailable.'];
  }
}

// Helper function to chunk content into smaller pieces
function chunkContent(content, maxWords = 500) {
  const words = content.split(' ');
  const chunks = [];
  
  for (let i = 0; i < words.length; i += maxWords) {
    const chunk = words.slice(i, i + maxWords).join(' ');
    if (chunk.trim()) {
      chunks.push(chunk);
    }
  }
  
  // If content is short, return as single chunk
  return chunks.length > 0 ? chunks : [content];
}

export default router;
