# Storage Architecture - SYPE Ministry

## 📦 Where Data is Stored

### Database (Structured Data)
- **Location**: Supabase PostgreSQL
- **Stores**:
  - Members
  - News Articles
  - Projects
  - Events
  - Donations
  - FAQs
  - Committee Members
  - Devotions
  - Email Subscribers
  - Media File Metadata (references to storage)

### Multimedia Files (Images, Videos, Documents)
- **Location**: Supabase Storage (Production) or Local `public/media` folder (Development)
- **Buckets**:
  - `images/` - All images (news, projects, members, committee, devotions, posters, graphics)
  - `videos/` - All videos (testimony, featured videos)
  - `documents/` - PDFs and documents

### Folder Structure in Supabase Storage

```
images/
  ├── news/           (News article images)
  ├── projects/       (Project images)
  ├── members/        (Member profile photos)
  ├── committee/      (Committee member photos)
  ├── devotions/      (Devotion poster images)
  ├── posters/        (Poster images)
  ├── graphics/       (Graphics and design files)
  └── media/          (General images)

videos/
  ├── testimony/      (Testimony videos)
  └── featured/       (Featured videos)

documents/
  ├── pdfs/           (PDF documents)
  └── files/          (Other documents)
```

## 🔄 How Upload Works

### Development (Local Storage)
1. User uploads file via admin panel
2. File saved to `public/media/` or `public/images/` folder
3. URL returned: `/media/images/category/filename.jpg`
4. Files served by Express static middleware

### Production (Supabase Storage)
1. User uploads file via admin panel
2. File received by backend (stored in memory temporarily)
3. File uploaded to Supabase Storage bucket
4. Supabase returns public CDN URL
5. URL saved to database/media metadata
6. Files served by Supabase CDN globally

## 🌐 Accessing Files

### Development
```
http://localhost:8080/media/images/news/article.jpg
http://localhost:8080/images/devotions/poster.jpg
```

### Production
```
https://xxxxx.supabase.co/storage/v1/object/public/images/news/article.jpg
https://xxxxx.supabase.co/storage/v1/object/public/images/devotions/poster.jpg
```

## 🔐 Security & Permissions

### Supabase Storage Buckets
- **Public**: ✅ Yes (for public access to images/videos)
- **Authenticated**: ❌ No (not needed for public content)
- **Policy**: Allow public read access

### File Size Limits
- Images: 50 MB per file
- Videos: 500 MB per file
- Documents: 100 MB per file

## 📊 Storage Costs (Free Tier)

### Supabase Free Tier
- **Storage**: 1 GB free
- **Bandwidth**: 2 GB/month free
- **File Upload Limit**: 50 MB per file

### Estimated Usage
- Small website: ~500 MB - 1 GB
- Medium website: 1-5 GB
- Large website: 5+ GB (may need paid plan)

## 🚀 Benefits of Supabase Storage

1. **CDN**: Files served globally via CDN (fast worldwide)
2. **Scalable**: Handles high traffic automatically
3. **Reliable**: 99.9% uptime SLA
4. **Secure**: Built-in access controls
5. **Simple**: Direct integration with database
6. **Free**: 1 GB free tier to start

## 🔧 Migration from Local to Supabase

When you deploy to production:
1. Supabase Storage buckets are automatically used
2. New uploads go to Supabase
3. Old local files remain in repo (can be migrated later)
4. Frontend receives Supabase CDN URLs

## 📝 Environment Variables

### Development (Local Files)
```env
# No Supabase needed - uses local storage
```

### Production (Supabase Storage)
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

When both are set, the app automatically uses Supabase Storage instead of local files.

---

**Note**: Currently, the app uses in-memory storage for database operations. To persist data, you'll need to migrate routes to use Prisma (see DEPLOYMENT_RENDER_SUPABASE.md).
