# SYPE Ministry - Deployment Guide

## Environment Variables (.env)

Before deploying your backend, create a `.env` file in the project root with the following variables:

### Required Environment Variables

```env
# Server Configuration
PORT=8080
NODE_ENV=production

# Database (PostgreSQL - Supabase)
DATABASE_URL=postgresql://username:password@host:5432/database_name
# Example: postgresql://postgres:yourpassword@db.xxxxx.supabase.co:5432/postgres

# Supabase Configuration (if using Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# YouTube API (for fetching videos)
YOUTUBE_API_KEY=your-youtube-api-key-here
# Get from: https://console.cloud.google.com/apis/credentials

# Optional: Email Service (if implementing email notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@sypeministry.org

# Optional: Site Configuration
SITE_URL=https://your-domain.com
SITE_NAME=SYPE Ministry
CONTACT_EMAIL=sypeministry@gmail.com
CONTACT_PHONE=+250780430990

# Optional: Security
JWT_SECRET=your-jwt-secret-key-change-this-in-production
SESSION_SECRET=your-session-secret-change-this-in-production

# Optional: File Upload Limits
MAX_FILE_SIZE=104857600
# 100MB in bytes (100 * 1024 * 1024)

# Optional: CORS Configuration (for production)
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

### Environment Variables Explanation

1. **PORT**: The port your Express server will run on (default: 8080)
2. **NODE_ENV**: Set to "production" for production deployment
3. **DATABASE_URL**: PostgreSQL connection string (from Supabase or your PostgreSQL provider)
4. **SUPABASE_URL/KEYS**: If using Supabase for storage and database
5. **YOUTUBE_API_KEY**: Required for fetching videos from YouTube channel
6. **SMTP_***: For email notifications (optional, can add later)
7. **SITE_URL**: Your website's domain name
8. **JWT_SECRET/SESSION_SECRET**: Random strings for session security (generate strong random strings)

### How to Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "YouTube Data API v3"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Restrict the API key to YouTube Data API v3 only
6. Copy the key to your `.env` file

### How to Get Supabase Credentials

1. Go to [Supabase](https://supabase.com/) and create a project
2. Go to Project Settings → API
3. Copy:
   - Project URL → `SUPABASE_URL`
   - `anon` public key → `SUPABASE_ANON_KEY`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)
4. Go to Project Settings → Database
5. Copy Connection String → `DATABASE_URL` (use Connection Pooling string for production)

## System Architecture

### How Components Work Together

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT-SIDE (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Public Site │  │  Admin Panel │  │  Components  │     │
│  │  (User)      │  │  (Admin)     │  │              │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                │
│         ┌──────────────────▼──────────────────┐            │
│         │      React Router / Navigation       │            │
│         └──────────────────┬──────────────────┘            │
└────────────────────────────┼────────────────────────────────┘
                             │
                             │ HTTP Requests (REST API)
                             │
┌────────────────────────────▼────────────────────────────────┐
│                    BACKEND (Express.js)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Routes                                           │  │
│  │  - /api/admin/* (CRUD operations)                    │  │
│  │  - /api/upload/* (File uploads)                      │  │
│  │  - /api/youtube/* (YouTube API)                      │  │
│  │  - /api/subscribe (Email subscriptions)              │  │
│  │  - /api/committee (Public committee data)            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Business Logic                                       │  │
│  │  - Data validation                                    │  │
│  │  - File processing (Multer)                           │  │
│  │  - YouTube API integration                            │  │
│  │  - Data transformation                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Static File Serving                                  │  │
│  │  - /images/* (Uploaded images)                        │  │
│  │  - /media/* (Videos, documents)                       │  │
│  │  - /public/* (Static assets)                          │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ Database Queries
                             │
┌────────────────────────────▼────────────────────────────────┐
│              DATABASE (PostgreSQL via Prisma)               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tables:                                             │  │
│  │  - members                                           │  │
│  │  - news_articles                                     │  │
│  │  - projects                                          │  │
│  │  - events                                            │  │
│  │  - donations                                         │  │
│  │  - faqs                                              │  │
│  │  - media_files                                       │  │
│  │  - books                                             │  │
│  │  - email_subscribers                                 │  │
│  │  - committee_members (future)                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              FILE STORAGE (GitHub Repository)               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  public/                                             │  │
│  │  ├── images/                                         │  │
│  │  │   ├── news/                                       │  │
│  │  │   ├── projects/                                   │  │
│  │  │   ├── members/                                    │  │
│  │  │   ├── events/                                     │  │
│  │  │   ├── media/                                      │  │
│  │  │   └── committee/                                  │  │
│  │  ├── media/                                          │  │
│  │  │   ├── images/                                     │  │
│  │  │   │   ├── graphics/                               │  │
│  │  │   │   └── posters/                                │  │
│  │  │   ├── videos/                                     │  │
│  │  │   │   └── testimony/                              │  │
│  │  │   ├── documents/                                  │  │
│  │  │   └── thumbnails/                                 │  │
│  │  └── Sype logo.png                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Admin Panel → Backend → Database

1. **Admin uploads media**:
   - Client: `DonationForm.tsx` → `POST /api/admin/donations`
   - Backend: `server/routes/admin.ts` → Validates → `donations.push()`
   - Response: New donation object with ID

2. **Admin creates project**:
   - Client: `ProjectManagement.tsx` → `POST /api/admin/projects`
   - Backend: `server/routes/admin.ts` → Validates → `projects.push()`
   - Response: Project object

3. **Admin uploads image**:
   - Client: `ImageUpload.tsx` → `POST /api/upload/image?category=news`
   - Backend: `server/routes/upload.ts` → Multer saves to `public/images/news/`
   - Response: File URL: `/images/news/filename.jpg`

### Client-Side → Backend → Database

1. **User views projects**:
   - Client: `Projects.tsx` → `GET /api/admin/projects?status=ongoing`
   - Backend: Filters projects → Returns JSON array
   - Client: Displays projects in cards

2. **User subscribes to email**:
   - Client: `Footer.tsx` → `POST /api/subscribe`
   - Backend: Validates email → Adds to `subscribers` array
   - Response: Subscriber object

3. **User submits donation**:
   - Client: `DonationForm.tsx` → `POST /api/admin/donations`
   - Backend: Validates → Creates donation record
   - Admin: Can view/manage in `DonationManagement.tsx`

## Why Books are Separate from Media Library

### Books vs Media - Different Purposes

**Books (Library Management)**:
- **Purpose**: Digital library resources (PDFs, EPUBs) for download
- **Categories**: Bible, Ellen G. White Books, Health, Genzura, etc.
- **Features**: 
  - Download tracking
  - Category-based organization
  - Featured books
  - ISBN, publisher, language metadata
  - Permanent resources

**Media (Media Management)**:
- **Purpose**: Visual content for website display (videos, images, posters)
- **Categories**: Testimony (videos), Graphics (images), Posters (images)
- **Features**:
  - Used in Videos & Multimedia page
  - Thumbnails for videos
  - Temporary/promotional content
  - Social media assets

**Key Differences**:
1. **Books** are downloadable resources with tracking
2. **Media** are display assets for the website
3. **Books** are permanent library content
4. **Media** are promotional/multimedia content
5. Different storage organization and management needs

## Performance Optimization

### 1. **Caching Strategy**
- YouTube API responses: 1-hour cache (already implemented)
- Static files: Served directly from `public/` folder
- Database queries: Consider adding Redis for caching in production

### 2. **Image Optimization**
- Images stored in GitHub can be optimized before commit
- Consider using image CDN in production (Cloudinary, ImageKit)
- Lazy loading for images on client-side

### 3. **Database Optimization**
- Index frequently queried fields (status, category, publishDate)
- Pagination for large lists (implement `limit` and `offset`)
- Connection pooling (Supabase handles this)

### 4. **API Optimization**
- Implement pagination for all list endpoints
- Add filtering and sorting options
- Rate limiting for API endpoints

### 5. **File Upload Optimization**
- Validate file types and sizes on both client and server
- Compress images on upload
- Use CDN for media files in production

## Deployment Checklist

- [ ] Set up `.env` file with all required variables
- [ ] Set up PostgreSQL database (Supabase recommended)
- [ ] Run database migrations (`npx prisma migrate dev` or `npx prisma db push`)
- [ ] Get YouTube API key and add to `.env`
- [ ] Test all admin functionalities (CRUD operations)
- [ ] Test file uploads (images, videos, documents)
- [ ] Test donation form submission
- [ ] Test email subscription
- [ ] Configure CORS for production domain
- [ ] Set up SSL certificate (HTTPS)
- [ ] Configure domain DNS settings
- [ ] Test all pages on production
- [ ] Set up backup strategy for database
- [ ] Configure error logging/monitoring
- [ ] Test on mobile devices
- [ ] Verify all forms work correctly
- [ ] Test admin authentication

## Production Considerations

1. **Security**:
   - Use environment variables for all secrets
   - Enable CORS only for your domain
   - Validate all user inputs
   - Sanitize file uploads
   - Use HTTPS only

2. **Performance**:
   - Enable gzip compression
   - Use CDN for static assets
   - Implement database indexing
   - Add caching layer (Redis)
   - Optimize images before upload

3. **Monitoring**:
   - Set up error tracking (Sentry, LogRocket)
   - Monitor API response times
   - Track database query performance
   - Monitor file upload sizes and counts

4. **Backup**:
   - Regular database backups (Supabase provides automatic backups)
   - Version control for code (GitHub)
   - Backup uploaded files (commit to GitHub or use cloud storage)

## Development vs Production

| Aspect | Development | Production |
|--------|------------|------------|
| Database | In-memory arrays | PostgreSQL (Supabase) |
| File Storage | `public/` folder | `public/` folder + CDN (optional) |
| Authentication | Simple username/password | JWT tokens (recommended) |
| Error Handling | Console logs | Error tracking service |
| API Rate Limiting | None | Implement rate limiting |
| CORS | Allow all origins | Restrict to your domain |
