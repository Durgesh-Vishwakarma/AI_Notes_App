import request from 'supertest';
import { app } from '../index.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Note from '../models/Note.js';
import jwt from 'jsonwebtoken';

describe('Notes API', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai_notes_test');
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Note.deleteMany({});

    // Create a test user and get auth token
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword'
    });
    await user.save();

    userId = user._id;
    authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'test_secret');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/notes', () => {
    it('should create a new note with valid data', async () => {
      const noteData = {
        title: 'Test Note',
        content: 'This is a test note content.',
        tags: ['test', 'api']
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(noteData)
        .expect(201);

      expect(response.body.title).toBe(noteData.title);
      expect(response.body.content).toBe(noteData.content);
      expect(response.body.tags).toEqual(noteData.tags);
      expect(response.body.user).toBe(userId.toString());
      expect(response.body.summary).toBeDefined();
    });

    it('should return 401 without auth token', async () => {
      const noteData = {
        title: 'Test Note',
        content: 'This is a test note content.',
        tags: ['test']
      };

      await request(app)
        .post('/api/notes')
        .send(noteData)
        .expect(401);
    });

    it('should return 400 for invalid note data', async () => {
      const invalidNoteData = {
        title: '', // Empty title should fail validation
        content: 'This is a test note content.'
      };

      const response = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidNoteData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/notes', () => {
    beforeEach(async () => {
      // Create test notes
      await Note.create([
        {
          user: userId,
          title: 'Note 1',
          content: 'Content 1',
          tags: ['tag1'],
          summary: ['Summary 1']
        },
        {
          user: userId,
          title: 'Note 2',
          content: 'Content 2',
          tags: ['tag2'],
          summary: ['Summary 2']
        }
      ]);
    });

    it('should get all notes for authenticated user', async () => {
      const response = await request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBeDefined();
      expect(response.body[0].user).toBe(userId.toString());
    });

    it('should return 401 without auth token', async () => {
      await request(app)
        .get('/api/notes')
        .expect(401);
    });
  });

  describe('PUT /api/notes/:id', () => {
    let noteId;

    beforeEach(async () => {
      const note = await Note.create({
        user: userId,
        title: 'Original Title',
        content: 'Original content',
        tags: ['original'],
        summary: ['Original summary']
      });
      noteId = note._id;
    });

    it('should update an existing note', async () => {
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content',
        tags: ['updated']
      };

      const response = await request(app)
        .put(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.content).toBe(updateData.content);
      expect(response.body.tags).toEqual(updateData.tags);
    });

    it('should return 404 for non-existent note', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      await request(app)
        .put(`/api/notes/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Title',
          content: 'Updated content'
        })
        .expect(404);
    });
  });

  describe('DELETE /api/notes/:id', () => {
    let noteId;

    beforeEach(async () => {
      const note = await Note.create({
        user: userId,
        title: 'Note to Delete',
        content: 'This note will be deleted',
        tags: ['delete'],
        summary: ['Summary to delete']
      });
      noteId = note._id;
    });

    it('should delete an existing note', async () => {
      const response = await request(app)
        .delete(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe('Note deleted');

      const deletedNote = await Note.findById(noteId);
      expect(deletedNote).toBeNull();
    });

    it('should return 404 for non-existent note', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      
      await request(app)
        .delete(`/api/notes/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('GET /api/notes/search', () => {
    beforeEach(async () => {
      await Note.create([
        {
          user: userId,
          title: 'JavaScript Tutorial',
          content: 'Learn JavaScript programming',
          tags: ['javascript', 'programming'],
          summary: ['JS tutorial summary']
        },
        {
          user: userId,
          title: 'Python Guide',
          content: 'Python programming basics',
          tags: ['python', 'programming'],
          summary: ['Python guide summary']
        }
      ]);
    });

    it('should search notes by title', async () => {
      const response = await request(app)
        .get('/api/notes/search?q=JavaScript')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('JavaScript Tutorial');
    });

    it('should search notes by tag', async () => {
      const response = await request(app)
        .get('/api/notes/search?tag=python')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Python Guide');
    });

    it('should return empty array for no query', async () => {
      const response = await request(app)
        .get('/api/notes/search')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(0);
    });
  });
});