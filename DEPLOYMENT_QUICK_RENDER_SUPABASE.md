# Quick Deployment Guide: Render + Supabase + Netlify

## 🎯 What We're Deploying

- **Backend**: Render.com (Node.js/Express API)
- **Database**: Supabase (PostgreSQL) 
- **Storage**: Supabase Storage (for images, videos, documents)
- **Frontend**: Netlify (React/Vite SPA)

## 📦 Where Everything is Stored

### Database (Supabase PostgreSQL)
Stores all structured data:
- Members, News, Projects, Events, Donations
- FAQs, Committee Members, Devotions
- Email Subscribers, Media metadata

### Multimedia Files (Supabase Storage)
Stored in public buckets:
- **`images/`** bucket: All images (news, projects, members, devotions, posters)
- **`videos/`** bucket: All videos (testimony, featured)
- **`documents/`** bucket: PDFs and documents

**Note**: Currently, uploads save to local `public/media` folder. After deployment, we'll update to use Supabase Storage (see below).

## ⚡ Quick Start (30 minutes)

### Step 1: Supabase Setup (10 min)

1. **Create Project**: [supabase.com](https://supabase.com) → New Project
   - Name: `sype-ministry`
   - Save your database password!

2. **Get Connection String**: Settings → Database → Connection String (URI)
   ```
   postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

3. **Get API Keys**: Settings → API
   - Copy: Project URL, anon key, service_role key

4. **Create Storage Buckets**: Storage → New Bucket
   - Create `images` bucket (Public: ✅ Yes)
   - Create `videos` bucket (Public: ✅ Yes)  
   - Create `documents` bucket (Public: ✅ Yes)

### Step 2: Deploy Backend on Render (10 min)

1. **Create Account**: [render.com](https://render.com) → Sign up with GitHub

2. **New Web Service**: Connect your `SYPE-Ministry` repo

3. **Configure**:
   - Name: `sype-ministry-api`
   - Build Command: `npm install && npm run build:server && npx prisma generate`
   - Start Command: `node dist/server/node-build.mjs`

4. **Add Environment Variables** (Environment tab):
   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   YOUTUBE_API_KEY=your-youtube-key
   ALLOWED_ORIGINS=https://your-netlify-app.netlify.app
   SITE_URL=https://your-netlify-app.netlify.app
   ```

5. **Deploy** - Render will auto-deploy. Get your backend URL: `https://sype-ministry-api.onrender.com`

### Step 3: Deploy Frontend on Netlify (5 min)

1. **In Netlify Dashboard**: Site Settings → Build & deploy
   - Build command: `npm run build:client`
   - Publish directory: `dist/client`

2. **Environment Variables**: Site Settings → Environment variables
   ```env
   VITE_API_BASE_URL=https://sype-ministry-api.onrender.com
   ```

3. **Deploy** - Netlify will auto-deploy. Get your frontend URL

### Step 4: Update CORS (2 min)

1. **In Render**: Update `ALLOWED_ORIGINS` with your Netlify URL
2. **Save** - Render will redeploy automatically

### Step 5: Test (3 min)

```bash
# Test backend
curl https://sype-ministry-api.onrender.com/health
curl https://sype-ministry-api.onrender.com/api/ping

# Test frontend
# Visit your Netlify URL and check browser console for API calls
```

## 📝 Storage Implementation Note

**Current State**: Files are saved to local `public/media` folder (works in development)

**For Production with Supabase Storage**:
- The code structure is ready (see `server/lib/supabase.ts`)
- Upload routes need to be updated to use Supabase Storage instead of local files
- This can be done after initial deployment

**Quick Fix for Now**:
- Render can serve static files from `public/` folder
- Files uploaded will be stored in Render's filesystem (temporary until container restarts)
- **Recommended**: Update to Supabase Storage after initial deployment

## 🔧 Update Upload Routes to Use Supabase (Future Enhancement)

After deployment works, we can update:
- `server/routes/upload.ts` - Use Supabase Storage
- `server/routes/mediaUpload.ts` - Use Supabase Storage  
- Files will then persist in Supabase Storage buckets

## ✅ Deployment Checklist

- [ ] Supabase project created
- [ ] Database connection string obtained
- [ ] Supabase API keys obtained
- [ ] Storage buckets created (`images`, `videos`, `documents`)
- [ ] Backend deployed on Render
- [ ] Backend environment variables set
- [ ] Backend health check passing
- [ ] Frontend deployed on Netlify
- [ ] Frontend environment variable set (`VITE_API_BASE_URL`)
- [ ] CORS updated with Netlify URL
- [ ] Test API calls from frontend
- [ ] Test file uploads (currently saves to Render filesystem)

## 🆘 Troubleshooting

**Build fails on Render**:
- Check build logs
- Verify `build:server` works locally
- Check Node.js version (18+)

**CORS errors**:
- Verify `ALLOWED_ORIGINS` includes Netlify URL
- Check no trailing slashes
- Verify `VITE_API_BASE_URL` is correct

**Upload issues**:
- Currently saves to Render filesystem (temporary)
- To persist: Update to Supabase Storage (see code update needed)

## 🎉 Next Steps After Deployment

1. Update upload routes to use Supabase Storage
2. Migrate existing files to Supabase (if any)
3. Test all upload functionality
4. Set up custom domains (optional)
5. Configure monitoring

---

**Total Time**: ~30 minutes
**Cost**: Free tier on all platforms
