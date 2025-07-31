# Deployment Guide for Render

## Prerequisites
- MongoDB Atlas account with your connection string
- Render account
- GitHub repository with your code

## Environment Variables

### Backend Environment Variables (Set in Render Dashboard)
- `MONGO_URI`: `mongodb+srv://sriannapoorani05:sap@cluster0.4oaleij.mongodb.net/alumni?retryWrites=true&w=majority&appName=Cluster0`
- `JWT_SECRET`: Generate a secure random string
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render will override this)

### Frontend Environment Variables (Set in Render Dashboard)
- `REACT_APP_API_URL`: `https://your-backend-service-name.onrender.com`

## Deployment Steps

### 1. Deploy Backend First
1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `alumni-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (or `backend` if you want to deploy only backend)

5. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string
   - `NODE_ENV`: `production`

6. Deploy and note the URL (e.g., `https://alumni-backend.onrender.com`)

### 2. Deploy Frontend
1. Go to Render Dashboard
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `alumni-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Root Directory**: Leave empty

5. Add Environment Variable:
   - `REACT_APP_API_URL`: Your backend URL from step 1

6. Deploy

### 3. Update CORS in Backend
After getting your frontend URL, update the CORS configuration in `backend/index.js`:
```javascript
origin: process.env.NODE_ENV === 'production' 
  ? ['https://your-frontend-service-name.onrender.com']
  : ['http://localhost:3000'],
```

### 4. Redeploy Backend
After updating CORS, redeploy your backend service.

## Important Notes

1. **File Uploads**: The current setup stores files locally. For production, consider using cloud storage like AWS S3 or Cloudinary.

2. **Database**: Your MongoDB Atlas cluster is already configured and ready to use.

3. **Environment Variables**: Make sure to set all required environment variables in Render dashboard.

4. **CORS**: Update the frontend URL in the backend CORS configuration after deployment.

5. **Health Check**: The backend includes a `/health` endpoint for monitoring.

## Testing Deployment

1. Test backend: Visit `https://your-backend-url.onrender.com/health`
2. Test frontend: Visit your frontend URL and try to register/login
3. Test file uploads: Try uploading profile photos and documents

## Troubleshooting

- Check Render logs for any build or runtime errors
- Verify environment variables are set correctly
- Ensure MongoDB connection string is valid
- Check CORS configuration if frontend can't connect to backend 