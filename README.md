# 🤖 AI Notes App – Smart Notes Manager

> A production-ready MERN stack application with AI-powered note summarization, demonstrating modern full-stack development practices.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://your-app-url.com) 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen)](https://nodejs.org/)

## 🎯 Project Overview

An intelligent note-taking application that combines traditional note management with cutting-edge AI summarization. Built with modern web technologies and production-ready architecture patterns.

### ✨ Key Features

- **🔐 Secure Authentication** - JWT-based auth with password hashing
- **📝 Rich Note Management** - Create, edit, delete, and organize notes
- **🏷️ Smart Tagging System** - Categorize and filter notes efficiently  
- **🔍 Advanced Search** - Search by title, content, and tags
- **🤖 AI Summarization** - Automatic note summarization using Hugging Face models
- **📱 Responsive Design** - Mobile-first approach with TailwindCSS
- **⚡ Real-time Updates** - Instant UI feedback and state management

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **Context API** - State management for authentication

### Backend
- **Node.js & Express** - Server-side runtime and framework
- **MongoDB & Mongoose** - NoSQL database with ODM
- **JWT** - Secure token-based authentication
- **bcryptjs** - Password hashing and security

### AI Integration
- **Hugging Face API** - Natural language processing
- **facebook/bart-large-cnn** - Text summarization model
- **Content chunking** - Handles long-form text processing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account or local MongoDB
- Hugging Face API key (optional, free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-notes-app.git
   cd ai-notes-app
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your MongoDB URI, JWT secret, and API keys
   
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   npm start
   ```

4. **Environment Variables**
   ```env
   # server/.env
   MONGO_URI=mongodb+srv://your-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   HF_API_KEY=your-hugging-face-api-key
   PORT=5000
   ```

## 📁 Project Structure

```
ai-notes-app/
├── client/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── contexts/          # React contexts
│   │   ├── services/          # API integration
│   │   └── utils/             # Helper functions
│   └── package.json
├── server/                    # Express backend
│   ├── models/                # MongoDB schemas
│   ├── routes/                # API endpoints
│   ├── middleware/            # Custom middleware
│   ├── utils/                 # Server utilities
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Notes Management
- `GET /api/notes` - Get all user notes
- `POST /api/notes` - Create new note with AI summary
- `PUT /api/notes/:id` - Update existing note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/search` - Search notes by title/tags

### AI Features
- `POST /api/notes/summarize` - Generate AI summary for content

## 🎨 Features in Detail

### AI-Powered Summarization
- **Intelligent Content Processing** - Chunks long content for better summarization
- **Multi-point Summaries** - Generates up to 8 key bullet points
- **Error Handling** - Graceful fallbacks when AI service is unavailable

### Search & Organization
- **Real-time Search** - Instant filtering as you type
- **Tag-based Filtering** - Organize notes with custom tags
- **Smart Results** - Search across titles, content, and summaries

### Security & Performance
- **JWT Authentication** - Secure, stateless authentication
- **Password Encryption** - bcrypt hashing for user security
- **Input Validation** - Server-side validation for all endpoints
- **Error Handling** - Comprehensive error responses

## 🚀 Deployment

This project is configured for deployment with **frontend on Vercel** and **backend on Render**.

### Backend Deployment on Render

1. **Create a Render account** at [render.com](https://render.com)

2. **Create a new Web Service**:
   - Connect your GitHub repository
   - Select the `server` folder as the root directory
   - Use the following settings:
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Node Version**: 18.x or higher

3. **Set Environment Variables** in Render dashboard:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-notes-app
   JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
   HF_API_KEY=your-hugging-face-api-key
   NODE_ENV=production
   ```

4. **Deploy**: Render will automatically build and deploy your backend

### Frontend Deployment on Vercel

1. **Create a Vercel account** at [vercel.com](https://vercel.com)

2. **Deploy from GitHub**:
   - Import your repository
   - Set **Root Directory** to `client`
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `build` (or leave default)

3. **Set Environment Variables** in Vercel dashboard:
   ```env
   REACT_APP_API_URL=https://your-backend-app-name.onrender.com/api
   ```
   Replace `your-backend-app-name` with your actual Render service name.

4. **Deploy**: Vercel will automatically build and deploy your frontend

### Manual Deployment Steps

#### Backend (Render)
```bash
# Make sure your server package.json has the correct start script
cd server
npm install
npm start  # This should work locally first
```

#### Frontend (Vercel)
```bash
# Test build locally
cd client
npm install
npm run build  # Should create a 'build' folder
```

### Environment Setup Checklist

- [ ] MongoDB Atlas database created and connection string ready
- [ ] JWT secret generated (minimum 32 characters)
- [ ] Hugging Face API key obtained (optional, for AI features)
- [ ] Backend deployed on Render with correct environment variables
- [ ] Frontend deployed on Vercel with correct API URL
- [ ] Test the deployed application end-to-end

### Deployment Troubleshooting

**Common Issues:**

1. **CORS Errors**: Make sure your backend allows requests from your Vercel domain
2. **Environment Variables**: Double-check all environment variables are set correctly
3. **API URL**: Ensure `REACT_APP_API_URL` points to your Render backend URL
4. **Build Failures**: Check that all dependencies are in `package.json`, not just `devDependencies`

**Backend Health Check**: Visit `https://your-backend-app-name.onrender.com/` to see "AI Notes App Backend"

**Frontend Check**: Your Vercel URL should load the React application

### Docker Deployment (Alternative)
```bash
# Build and run with Docker
docker-compose up --build
```

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd ../client
npm test
```

## 📈 Performance Features

- **Optimized Database Queries** - Efficient MongoDB indexes
- **Lazy Loading** - Components loaded on demand
- **Error Boundaries** - Graceful error handling in React
- **Request Caching** - Smart API response caching

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ About the Developer

Built by [Your Name] as a demonstration of modern full-stack development skills including:
- MERN stack proficiency
- RESTful API design
- AI/ML integration
- Modern UI/UX principles
- Production deployment practices

---

⭐ **Star this repository if you found it helpful!**