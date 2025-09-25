# Deployment Guide: AI Notes App

This document provides step-by-step instructions for deploying the AI Notes App with frontend on Vercel and backend on Render.

## Prerequisites

Before deploying, ensure you have:
- [ ] GitHub repository with your code
- [ ] MongoDB Atlas account and database setup
- [ ] Accounts on Vercel and Render (both have free tiers)
- [ ] Hugging Face API key (optional, for AI summarization features)

## Step 1: Backend Deployment on Render

### 1.1 Create MongoDB Atlas Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs or specific ones)
5. Get your connection string

### 1.2 Deploy Backend on Render
1. Go to [Render](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `ai-notes-backend` (or your preferred name)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (for testing)

### 1.3 Set Environment Variables
In your Render service dashboard, add these environment variables:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-notes-app?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
HF_API_KEY=hf_your_hugging_face_api_key_here
NODE_ENV=production
```

**Important**: 
- Replace `username:password` with your MongoDB Atlas credentials
- Generate a strong JWT secret (at least 32 characters)
- Get your Hugging Face API key from [huggingface.co](https://huggingface.co)

### 1.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete (5-10 minutes)
3. Note your backend URL (e.g., `https://ai-notes-backend.onrender.com`)

## Step 2: Frontend Deployment on Vercel

### 2.1 Deploy Frontend on Vercel
1. Go to [Vercel](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `build` (default)
   - **Install Command**: `npm install` (default)

### 2.2 Set Environment Variables
In your Vercel project dashboard, go to Settings → Environment Variables and add:

```env
REACT_APP_API_URL=https://your-backend-name.onrender.com/api
```

Replace `your-backend-name` with your actual Render service name.

### 2.3 Deploy
1. Click "Deploy"
2. Wait for deployment to complete (2-5 minutes)
3. Note your frontend URL (e.g., `https://your-app.vercel.app`)

## Step 3: Testing Your Deployment

### 3.1 Backend Health Check
Visit your Render backend URL directly:
```
https://your-backend-name.onrender.com/
```
You should see: "AI Notes App Backend"

### 3.2 Frontend Test
1. Visit your Vercel frontend URL
2. Try to register a new user
3. Login with the new user
4. Create a note
5. Test AI summarization (if HF_API_KEY is configured)

## Step 4: Post-Deployment Configuration

### 4.1 Custom Domains (Optional)
- **Vercel**: Add custom domain in project settings
- **Render**: Add custom domain in service settings

### 4.2 CORS Configuration
If you encounter CORS issues, update your backend's CORS configuration in `/server/index.js`:

```javascript
app.use(cors({
  origin: ['https://your-frontend-domain.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

## Troubleshooting

### Common Issues and Solutions

1. **Build Fails on Render**
   - Check that all dependencies are in `dependencies`, not `devDependencies`
   - Ensure Node.js version compatibility

2. **Frontend Can't Connect to Backend**
   - Verify `REACT_APP_API_URL` is correct
   - Check backend is running (visit the health check URL)
   - Ensure CORS is properly configured

3. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check network access settings in MongoDB Atlas
   - Ensure database user has proper permissions

4. **Authentication Issues**
   - Verify JWT_SECRET is set and consistent
   - Check token expiration settings

5. **AI Features Not Working**
   - Verify HF_API_KEY is correct
   - Check Hugging Face API quota/limits

### Logs and Debugging
- **Render**: View logs in service dashboard
- **Vercel**: View function logs in project dashboard
- **Browser**: Check network tab and console for errors

## Free Tier Limitations

### Render Free Tier
- Service spins down after 15 minutes of inactivity
- 750 hours per month
- First request after spin-down may be slow (cold start)

### Vercel Free Tier
- 100GB bandwidth per month
- Unlimited static deployments
- Serverless functions with execution limits

### MongoDB Atlas Free Tier
- 512MB storage
- Shared clusters
- No backup/restore

## Upgrading for Production

For production use, consider:
- Upgrading to paid plans for better performance
- Setting up monitoring and alerts
- Implementing proper error tracking
- Adding automated testing and CI/CD
- Setting up backup strategies
- Implementing rate limiting and security measures

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review service logs (Render/Vercel dashboards)
3. Verify all environment variables are set correctly
4. Test locally first to isolate deployment-specific issues

---

**Note**: The first deployment may take longer as services need to install dependencies and build your application. Subsequent deployments will be faster.