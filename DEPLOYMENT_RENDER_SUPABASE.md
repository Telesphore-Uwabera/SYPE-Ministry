# Complete Deployment Guide: Render + Supabase + Netlify

This guide walks you through deploying:
- **Backend**: Render.com
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (for multimedia files)
- **Frontend**: Netlify

## 📋 Prerequisites

- GitHub repository with your code
- Accounts on:
  - [Supabase](https://supabase.com) (free tier)
  - [Render](https://render.com) (free tier available)
  - [Netlify](https://netlify.com) (already set up)

## Step 1: Set Up Supabase Database & Storage (15 minutes)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Project Name**: `sype-ministry`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., `North America`, `Europe`, `Asia Pacific`)
4. Click **"Create new project"** (takes 1-2 minutes)

### 1.2 Get Database Connection String

1. In your Supabase project, go to **Settings** → **Database**
2. Scroll to **Connection String** section
3. Select **URI** tab
4. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual database password
6. **Save this connection string** - you'll need it for Render

### 1.3 Get Supabase API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`) - **Keep this secret!**

### 1.4 Set Up Supabase Storage Buckets

You need to create storage buckets for different types of files:

1. Go to **Storage** in your Supabase dashboard
2. Click **"New bucket"**
3. Create these buckets (one at a time):

   **Bucket 1: `images`**
   - Name: `images`
   - Public: ✅ **Yes** (checked)
   - Allowed MIME types: `image/jpeg, image/png, image/gif, image/webp, image/svg+xml`
   - File size limit: `50 MB`
   - Click **"Create bucket"**

   **Bucket 2: `videos`**
   - Name: `videos`
   - Public: ✅ **Yes** (checked)
   - Allowed MIME types: `video/mp4, video/mpeg, video/quicktime, video/webm`
   - File size limit: `500 MB`
   - Click **"Create bucket"**

   **Bucket 3: `documents`**
   - Name: `documents`
   - Public: ✅ **Yes** (checked)
   - Allowed MIME types: `application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document`
   - File size limit: `100 MB`
   - Click **"Create bucket"**

4. For each bucket, set up folder structure:
   - In bucket settings, you can organize files in folders:
     - `images/news/`
     - `images/projects/`
     - `images/members/`
     - `images/committee/`
     - `images/devotions/`
     - `images/posters/`
     - `images/graphics/`
     - `videos/testimony/`
     - etc.

### 1.5 Set Up Database Schema (Optional - if using Prisma)

If you want to use the Prisma schema:

1. In your local project, update `.env` with your Supabase connection string:
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
   ```

2. Run migrations:
   ```bash
   npm run db:push
   ```

**Note**: Currently, the app uses in-memory storage. To use the database, you'll need to update the routes to use Prisma. This can be done later.

## Step 2: Deploy Backend on Render (20 minutes)

### 2.1 Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repositories

### 2.2 Create Web Service (Backend)

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository (`SYPE-Ministry`)
3. Configure the service:

   **Basic Settings:**
   - **Name**: `sype-ministry-api`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty (`.`)
   - **Environment**: **Node**

   **Build Settings:**
   - **Build Command**: 
     ```bash
     npm install && npm run build:server && npx prisma generate
     ```
   - **Start Command**: 
     ```bash
     node dist/server/node-build.mjs
     ```

   **Plan**: Start with **Free** (can upgrade later)

4. Click **"Advanced"** → **"Add Environment Variable"** and add:

   ```env
   NODE_ENV=production
   PORT=10000
   ```

   **Note**: Render provides `PORT` automatically, but we set it explicitly for clarity.

5. Click **"Create Web Service"**

### 2.3 Add Environment Variables to Render

Once the service is created, go to **Environment** tab and add:

```env
# Database
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# YouTube API (for videos page)
YOUTUBE_API_KEY=your-youtube-api-key

# Site Configuration
SITE_URL=https://your-netlify-app.netlify.app
SITE_NAME=SYPE Ministry
CONTACT_EMAIL=sypeministry@gmail.com
CONTACT_PHONE=+250780430990

# CORS - Add your frontend URL after Netlify deployment
ALLOWED_ORIGINS=https://your-netlify-app.netlify.app,https://www.yourdomain.com

# File Upload Limits
MAX_FILE_SIZE=104857600

# Optional
PING_MESSAGE=pong
```

**Important**: 
- Replace `[YOUR-PASSWORD]` with your actual Supabase database password
- Replace `xxxxx` with your actual Supabase project reference
- Replace `your-anon-key-here` and `your-service-role-key-here` with actual keys
- You'll update `ALLOWED_ORIGINS` after deploying frontend

### 2.4 Deploy Backend

1. Render will automatically start building and deploying
2. Wait for the build to complete (3-5 minutes)
3. Once deployed, you'll get a URL like: `https://sype-ministry-api.onrender.com`
4. Test the backend:
   ```bash
   curl https://sype-ministry-api.onrender.com/health
   # Should return: {"status":"ok","timestamp":"..."}
   
   curl https://sype-ministry-api.onrender.com/api/ping
   # Should return: {"message":"pong"}
   ```

### 2.5 Enable Render Auto-Deploy

- Render automatically deploys when you push to `main` branch
- You can disable this in **Settings** → **Auto-Deploy** if needed

## Step 3: Deploy Frontend on Netlify (10 minutes)

### 3.1 Configure Netlify Build Settings

1. In your Netlify dashboard, go to your site (or create new site)
2. Go to **Site settings** → **Build & deploy**
3. Update settings:

   **Build settings:**
   - **Build command**: `npm run build:client`
   - **Publish directory**: `dist/client`
   - **Base directory**: Leave empty (`.`)

### 3.2 Add Environment Variables to Netlify

1. Go to **Site settings** → **Environment variables**
2. Add:

   ```env
   VITE_API_BASE_URL=https://sype-ministry-api.onrender.com
   ```

   **Important**: Replace with your actual Render backend URL

### 3.3 Deploy Frontend

1. Netlify should automatically trigger a new deployment
2. Or manually trigger: **Deploys** → **Trigger deploy** → **Deploy site**
3. Wait for build to complete (2-3 minutes)
4. You'll get a URL like: `https://sype-ministry.netlify.app`

### 3.4 Update Backend CORS

After frontend is deployed, update Render backend environment variable:

1. Go to Render dashboard → Your service → **Environment**
2. Update `ALLOWED_ORIGINS`:
   ```env
   ALLOWED_ORIGINS=https://sype-ministry.netlify.app,https://your-custom-domain.com
   ```
3. Render will automatically redeploy with new environment variables

## Step 4: Update Upload Routes for Supabase Storage

The backend currently uses local file storage. We need to update it to use Supabase Storage. The code is ready, but we need to update the upload routes.

**This will be done in the next step - see the code updates.**

## Step 5: Test Everything

### 5.1 Test Backend

```bash
# Health check
curl https://sype-ministry-api.onrender.com/health

# API test
curl https://sype-ministry-api.onrender.com/api/ping
```

### 5.2 Test Frontend

1. Visit your Netlify URL
2. Open browser DevTools → **Network** tab
3. Check that API calls are working
4. Test:
   - Navigation
   - Admin panel
   - Form submissions
   - **Image uploads** (should upload to Supabase Storage)

### 5.3 Test Storage

1. Upload an image through admin panel
2. Check Supabase dashboard → **Storage** → **images** bucket
3. Verify file is there
4. Verify file URL is accessible publicly

## 📍 Storage Architecture

```
┌─────────────────────────────────────────────────┐
│            User Uploads File                    │
│         (via Admin Panel/Frontend)              │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│         Backend (Render)                        │
│    Receives file via POST /api/upload/*        │
│    Uploads to Supabase Storage                  │
│    Returns public URL                           │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│       Supabase Storage Buckets                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ images/  │  │ videos/  │  │documents/│     │
│  │          │  │          │  │          │     │
│  │ - news/  │  │ -testimony│ │ - pdfs/  │     │
│  │ -projects│  │          │  │          │     │
│  │ -devotions│ │          │  │          │     │
│  └──────────┘  └──────────┘  └──────────┘     │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│         Public CDN URLs                         │
│  https://xxxxx.supabase.co/storage/v1/...       │
│  (Served by Supabase CDN)                       │
└─────────────────────────────────────────────────┘
```

## 🔧 Environment Variables Summary

### Backend (Render)
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
YOUTUBE_API_KEY=...
ALLOWED_ORIGINS=https://...
SITE_URL=https://...
```

### Frontend (Netlify)
```env
VITE_API_BASE_URL=https://sype-ministry-api.onrender.com
```

## ✅ Deployment Checklist

- [ ] Supabase project created
- [ ] Database connection string obtained
- [ ] Supabase API keys obtained
- [ ] Storage buckets created (`images`, `videos`, `documents`)
- [ ] Backend deployed on Render
- [ ] Backend environment variables set
- [ ] Backend health check passing
- [ ] Frontend deployed on Netlify
- [ ] Frontend environment variables set
- [ ] CORS updated in backend
- [ ] Test upload functionality
- [ ] Verify files appear in Supabase Storage
- [ ] Test public URL access

## 🆘 Troubleshooting

### Backend Build Fails
- Check build logs in Render
- Verify `build:server` script works locally
- Check Node.js version (should be 18+)

### CORS Errors
- Verify `ALLOWED_ORIGINS` includes your Netlify URL
- Check no trailing slashes
- Verify frontend `VITE_API_BASE_URL` is correct

### Upload Failures
- Check Supabase Storage buckets exist
- Verify buckets are public
- Check `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Verify file size limits

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database password is correct
- Verify Supabase database is running

## 🎉 Next Steps

1. Set up custom domains (optional)
2. Configure SSL (automatic on all platforms)
3. Set up monitoring
4. Configure backups for database
5. Set up CDN for static assets (optional - Supabase already provides CDN)

---

**Estimated Total Time**: ~45 minutes
**Cost**: Free tier on all platforms (can scale up as needed)
