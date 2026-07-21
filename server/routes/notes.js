import express from 'express';
import Note from '../models/Note.js';
import auth from '../middleware/auth.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Legacy sentinel: earlier versions stored this string as if it were a real
// summary whenever the upstream call failed. Filter it out on read so old
// notes stop displaying an error message as their summary.
const LEGACY_FAILURE_SENTINEL = 'AI summary unavailable.';

const cleanSummary = (summary) =>
  Array.isArray(summary)
    ? summary.filter((s) => typeof s === 'string' && s.trim() && s !== LEGACY_FAILURE_SENTINEL)
    : [];

const serialiseNote = (note) => {
  const obj = typeof note.toObject === 'function' ? note.toObject() : { ...note };
  return { ...obj, summary: cleanSummary(obj.summary) };
};

/* -------------------------------------------------------------------------
   SUMMARIZE
   ------------------------------------------------------------------------- */

router.post('/summarize', auth, async (req, res) => {
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ message: 'Nothing to summarise — the note is empty.' });
  }

  try {
    const summary = await getSummary(content);
    res.json({ summary });
  } catch (err) {
    // Report the real reason instead of returning a fake summary. The client
    // shows this message, so it has to be something a user can act on.
    console.error('Summarization failed:', err.status || '', err.message);
    res.status(err.status || 502).json({ message: err.message });
  }
});

/* -------------------------------------------------------------------------
   CRUD
   ------------------------------------------------------------------------- */

// Create. Summaries are generated explicitly via /summarize and sent up with
// the note — the previous version called the summariser inline here, which
// made every save wait on a third-party request and silently discarded the
// summary the user had already generated in the editor.
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags, summary } = req.body;

    const note = new Note({
      user: req.user,
      title,
      content,
      tags,
      summary: cleanSummary(summary),
    });

    await note.save();
    res.status(201).json(serialiseNote(note));
  } catch (err) {
    console.error('Note creation error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Get all notes for the signed-in user, newest first
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user }).sort({ updatedAt: -1, createdAt: -1 });
    res.json(notes.map(serialiseNote));
  } catch (err) {
    console.error('Note fetch error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Update. Also respects the client's summary rather than regenerating it,
// so removing a summary in the editor actually persists.
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, tags, summary } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      {
        title,
        content,
        tags,
        summary: cleanSummary(summary),
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!note) return res.status(404).json({ message: 'Note not found' });

    res.json(serialiseNote(note));
  } catch (err) {
    console.error('Note update error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search. Kept for API compatibility; the dashboard now filters client-side.
router.get('/search', auth, async (req, res) => {
  try {
    const { q, tag } = req.query;

    if ((!q || !q.trim()) && !tag) return res.json([]);

    const query = { user: req.user };

    if (q && q.trim()) {
      // Previously matched titles only, so searching for a word in the body
      // of a note returned nothing.
      const rx = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [{ title: rx }, { content: rx }];
    }

    if (tag) query.tags = tag;

    const notes = await Note.find(query).sort({ updatedAt: -1 });
    res.json(notes.map(serialiseNote));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -------------------------------------------------------------------------
   HUGGING FACE SUMMARISATION

   The old endpoint (api-inference.huggingface.co) was retired and now
   responds with "no longer supported". Requests go to the Inference
   Providers router instead, which also requires a token — the previous code
   sent the Authorization header only when HF_API_KEY happened to be set.
   ------------------------------------------------------------------------- */

const HF_MODEL = process.env.HF_MODEL || 'facebook/bart-large-cnn';
const HF_ENDPOINT =
  process.env.HF_ENDPOINT || `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`;

class SummaryError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function summariseChunk(chunk, { attempt = 0 } = {}) {
  try {
    const response = await axios.post(
      HF_ENDPOINT,
      {
        inputs: chunk,
        parameters: { max_length: 150, min_length: 30, do_sample: false },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
        timeout: 30000,
      }
    );

    const data = response.data;
    return (Array.isArray(data) ? data[0]?.summary_text : data?.summary_text) || '';
  } catch (err) {
    const status = err.response?.status;

    // 503 means the model is warming up on a cold start. One retry usually
    // clears it; failing immediately made the feature look permanently broken.
    if (status === 503 && attempt < 1) {
      await sleep(4000);
      return summariseChunk(chunk, { attempt: attempt + 1 });
    }

    if (status === 401 || status === 403) {
      throw new SummaryError(
        'The summarisation service rejected the API key. Check HF_API_KEY on the server.',
        502
      );
    }

    if (status === 429) {
      throw new SummaryError(
        'Summarisation rate limit reached. Please wait a minute and try again.',
        429
      );
    }

    if (status === 503) {
      throw new SummaryError(
        'The summarisation model is still starting up. Try again in about a minute.',
        503
      );
    }

    if (err.code === 'ECONNABORTED') {
      throw new SummaryError('Summarising timed out. Try again, or shorten the note.', 504);
    }

    throw new SummaryError(
      err.response?.data?.error || 'The summarisation service is unavailable right now.',
      502
    );
  }
}

async function getSummary(content) {
  if (!process.env.HF_API_KEY) {
    throw new SummaryError(
      'Summarisation is not configured on the server (HF_API_KEY is missing).',
      503
    );
  }

  const chunks = chunkContent(content, 500);
  const summaries = [];

  for (const chunk of chunks) {
    const summary = await summariseChunk(chunk);
    if (summary) summaries.push(summary);
  }

  if (summaries.length === 0) {
    throw new SummaryError('The summariser returned nothing for this note.', 502);
  }

  return summaries
    .join(' ')
    .split(/\.\s+/)
    .map((line) => line.trim().replace(/\.$/, ''))
    .filter((line) => line.length > 10)
    .slice(0, 8);
}

function chunkContent(content, maxWords = 500) {
  const words = content.trim().split(/\s+/);
  const chunks = [];

  for (let i = 0; i < words.length; i += maxWords) {
    const chunk = words.slice(i, i + maxWords).join(' ');
    if (chunk.trim()) chunks.push(chunk);
  }

  return chunks.length > 0 ? chunks : [content];
}

export default router;
