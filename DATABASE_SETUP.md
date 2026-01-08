# Database Setup Guide - Supabase

This guide will help you set up **Supabase** (PostgreSQL + Storage) for the SYPE Ministry admin panel.

## Why Supabase?

✅ **PostgreSQL Database** - Robust relational database  
✅ **Built-in Storage** - Perfect for images, videos, and documents  
✅ **Free Tier** - 500MB database + 1GB storage  
✅ **GitHub Integration** - Easy deployment  
✅ **Custom Domain** - Works with Name.com domains  
✅ **Auto-scaling** - Handles growth automatically  

## Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Click "New Project"
4. Fill in:
   - **Project Name**: `sype-ministry` (or your choice)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project" (takes ~2 minutes)

## Step 2: Get Your Connection Details

Once your project is ready:

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL** (SUPABASE_URL)
   - **anon/public key** (SUPABASE_ANON_KEY)
   - **service_role key** (SUPABASE_SERVICE_ROLE_KEY) - Keep this secret!

3. Go to **Project Settings** → **Database**
4. Copy the **Connection string** under "Connection string" → **URI**
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
   - Replace `[YOUR-PASSWORD]` with your actual database password

## Step 3: Configure Environment Variables

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
   SUPABASE_URL="https://xxxxx.supabase.co"
   SUPABASE_ANON_KEY="your-anon-key-here"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
   ```

## Step 4: Set Up Storage Buckets

1. In Supabase Dashboard, go to **Storage**
2. Create these buckets (click "New bucket"):
   - **`images`** - Public bucket for images
   - **`videos`** - Public bucket for videos  
   - **`documents`** - Public bucket for documents

   For each bucket:
   - Check "Public bucket" ✅
   - Click "Create bucket"

## Step 5: Initialize Database

1. Generate Prisma Client:
   ```bash
   npm run db:generate
   ```

2. Push schema to database:
   ```bash
   npm run db:push
   ```

   This creates all tables in your Supabase database.

3. (Optional) Open Prisma Studio to view your database:
   ```bash
   npm run db:studio
   ```

## Step 6: Verify Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to `http://localhost:8080/admin`
3. Try creating a member or news article
4. Check Supabase Dashboard → **Table Editor** to see your data

## Deployment with GitHub + Name.com

### Frontend (Netlify/Vercel)

1. **Connect GitHub**:
   - Push your code to GitHub
   - Go to Netlify/Vercel
   - Import your GitHub repository

2. **Add Environment Variables**:
   - In Netlify/Vercel dashboard
   - Go to Site Settings → Environment Variables
   - Add all variables from your `.env` file

3. **Connect Name.com Domain**:
   - In Netlify/Vercel, go to Domain Settings
   - Add your Name.com domain
   - Follow DNS configuration instructions

### Backend (Railway/Render)

1. **Deploy Backend**:
   - Connect GitHub repo to Railway/Render
   - Add environment variables
   - Deploy

2. **Update Frontend**:
   - Update API URLs in frontend to point to your backend

## Image Upload Example

Images are stored in Supabase Storage, not in the database. The database only stores the URL.

```typescript
import { uploadFile, STORAGE_BUCKETS } from "@/server/lib/supabase";

// Upload image
const { url } = await uploadFile(
  STORAGE_BUCKETS.IMAGES,
  `news/${Date.now()}-${file.name}`,
  file
);

// Save URL to database
await prisma.newsArticle.create({
  data: {
    title: "News Title",
    image: url, // Store URL, not the file
    // ... other fields
  },
});
```

## Free Tier Limits

- **Database**: 500 MB
- **Storage**: 1 GB
- **Bandwidth**: 2 GB/month
- **API Requests**: 50,000/month

For production, consider upgrading to Pro plan ($25/month) for:
- 8 GB database
- 100 GB storage
- Unlimited bandwidth

## Troubleshooting

**"Connection refused" error:**
- Check your DATABASE_URL is correct
- Verify your database password
- Ensure your IP is allowed (Supabase allows all by default)

**"Storage bucket not found" error:**
- Make sure you created the buckets in Step 4
- Check bucket names match exactly: `images`, `videos`, `documents`

**"Prisma Client not generated" error:**
- Run `npm run db:generate`
- Restart your dev server

## Support

- Supabase Docs: https://supabase.com/docs
- Prisma Docs: https://www.prisma.io/docs
- SYPE Ministry GitHub: [Your repo URL]
