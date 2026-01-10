# SYPE Ministry Website

A modern, production-ready website for SYPE (Seventh-day Adventist Young Professionals in Evangelism) - a ministry equipping young professionals for evangelism through talents, professions, and service.

**Live Website:** [https://sypeministry.netlify.app](https://sypeministry.netlify.app)

---

## 🌟 Overview

SYPE Ministry is a full-stack web application built to serve the Seventh-day Adventist Young Professionals in Evangelism community. The website provides information about the ministry, membership opportunities, resources, and facilitates engagement with the community.

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Repository                     │
│              (SYPE-Ministry source code)                 │
└─────────────┬───────────────────────┬───────────────────┘
              │                       │
              ▼                       ▼
    ┌──────────────────┐    ┌──────────────────┐
    │   Backend        │    │   Frontend       │
    │   (Render)       │    │   (Netlify)      │
    │                  │    │                  │
    │  Port: 3000      │◄───┤  API Calls       │
    │  Health: /health │    │  via env var     │
    └────────┬─────────┘    └──────────────────┘
             │
             │ DATABASE_URL
             ▼
    ┌──────────────────┐    ┌──────────────────┐
    │   Database       │    │   Storage        │
    │   (Supabase      │    │   (Supabase      │
    │    PostgreSQL)   │    │    Storage)      │
    └──────────────────┘    └──────────────────┘
```

## 🚀 Tech Stack

- **Frontend**: React 18 + React Router 6 (SPA) + TypeScript + Vite
- **Styling**: TailwindCSS 3 + Radix UI components + Shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (via Supabase)
- **Storage**: Supabase Storage (for multimedia files)
- **Package Manager**: PNPM
- **Testing**: Vitest
- **Deployment**: 
  - Frontend: Netlify
  - Backend: Render.com
  - Database: Supabase
  - Storage: Supabase Storage

## 📁 Project Structure

```
SYPE Ministry/
├── client/                   # React SPA frontend
│   ├── pages/                # Route components
│   │   ├── Home.tsx          # Homepage
│   │   ├── About.tsx         # About page with committee members
│   │   ├── Membership.tsx    # Membership information
│   │   ├── Donations.tsx     # Donation page
│   │   ├── Contact.tsx       # Contact page
│   │   ├── FAQs.tsx          # FAQs page
│   │   ├── Devotions.tsx     # Daily devotion program
│   │   ├── Projects.tsx      # Evangelical projects
│   │   ├── Library.tsx       # Digital library
│   │   ├── News.tsx          # News articles
│   │   ├── Departments.tsx   # Ministry departments
│   │   ├── Videos.tsx        # Videos page
│   │   └── Admin.tsx         # Admin dashboard
│   ├── components/           # Reusable components
│   │   ├── Layout.tsx        # Main layout wrapper
│   │   ├── Navigation.tsx    # Navigation bar
│   │   ├── Footer.tsx        # Footer component
│   │   ├── BackToTop.tsx     # Back to top button
│   │   ├── SEO.tsx           # SEO meta tags component
│   │   ├── DonationForm.tsx  # Donation form
│   │   └── admin/            # Admin panel components
│   │       ├── MemberManagement.tsx
│   │       ├── ProjectManagement.tsx
│   │       ├── NewsManagement.tsx
│   │       ├── MediaManagement.tsx
│   │       └── ...
│   ├── lib/                  # Utilities
│   │   ├── apiConfig.ts      # API base URL configuration
│   │   └── adminStore.ts     # Admin data store
│   ├── types/                # TypeScript types
│   │   └── admin.ts          # Admin-related types
│   └── global.css            # TailwindCSS styles
│
├── server/                   # Express API backend
│   ├── index.ts              # Server setup with CORS & middleware
│   ├── node-build.ts         # Production entry point
│   ├── routes/               # API route handlers
│   │   ├── admin.ts          # Admin CRUD endpoints
│   │   ├── upload.ts         # Image upload endpoints
│   │   ├── mediaUpload.ts    # Media file upload endpoints
│   │   └── youtube.ts        # YouTube API integration
│   └── lib/                  # Backend utilities
│       ├── upload.ts         # Image upload config (Multer)
│       ├── mediaUpload.ts    # Media upload config (Multer)
│       ├── supabase.ts       # Supabase client & storage helpers
│       ├── storageAdapter.ts # Storage adapter (local/Supabase)
│       └── prisma.ts         # Database client
│
├── prisma/                   # Database schema
│   └── schema.prisma         # Prisma schema (PostgreSQL)
│
├── public/                   # Static assets
│   ├── media/                # Media files (dev only)
│   │   ├── images/           # Image uploads
│   │   ├── videos/           # Video uploads
│   │   └── documents/        # Document uploads
│   └── images/               # Static images
│
└── Configuration Files
    ├── package.json          # Dependencies & scripts
    ├── vite.config.ts        # Vite client config
    ├── vite.config.server.ts # Vite server build config
    ├── tsconfig.json         # TypeScript config
    ├── tailwind.config.ts    # Tailwind CSS config
    ├── netlify.toml          # Netlify deployment config
    ├── render.yaml           # Render deployment config
    └── railway.json          # Railway deployment config
```

## ✨ Features

### Public Features
- **Responsive Design**: Mobile-first, works on all devices
- **Modern UI**: Beautiful, accessible interface with animations
- **SEO Optimized**: Meta tags, Open Graph, Twitter Cards, structured data
- **Smooth Navigation**: Smooth scrolling, back-to-top button
- **Contact Information**: Email, phone numbers, social media links
- **Legal Pages**: Terms, Privacy Policy, Cookies Policy
- **FAQs Section**: Comprehensive FAQ with accordion interface

### Content Pages
- **Home**: Hero section, latest news, devotions, and videos
- **About**: History, mission, committee members, departments
- **Membership**: Eligibility and benefits information
- **Donations**: Donation form with payment status tracking
- **Contact**: Multiple contact methods and location
- **Devotions**: Daily devotion program with poster gallery
- **Projects**: Evangelical initiatives with date-based filtering
- **Library**: Digital library with book downloads
- **News**: News articles with search functionality
- **Departments**: 8 ministry departments with descriptions
- **Videos**: YouTube integration and featured videos

### Admin Panel Features
- **Member Management**: CRUD operations for members
- **News Management**: Create, edit, delete news articles
- **Project Management**: Manage projects with date filtering
- **Event Management**: Create and manage events
- **Donation Management**: Track donations with payment status
- **Media Management**: Upload images, videos, documents to Supabase Storage
- **Book Management**: Manage library books
- **Committee Management**: Manage committee members by category
- **Devotion Management**: Create and manage devotions
- **Email Subscribers**: Manage newsletter subscribers
- **Analytics Dashboard**: View statistics and metrics

---

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- PNPM (recommended) or npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Telesphore-Uwabera/SYPE-Ministry.git
cd SYPE-Ministry

# Install dependencies
pnpm install

# Or with npm
npm install
```

### Environment Variables

Create a `.env` file in the root directory (copy from `env.example`):

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database (PostgreSQL - Supabase)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase Configuration (Optional - if using Supabase)
SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"

# YouTube Data API v3 Key (Required for Videos page)
YOUTUBE_API_KEY="your-youtube-api-key-here"

# Site Configuration
SITE_URL=http://localhost:8080
SITE_NAME=SYPE Ministry
CONTACT_EMAIL=sypeministry@gmail.com
CONTACT_PHONE=+250780430990

# CORS Configuration (for development)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8080,http://localhost:3000

# Optional: File Upload Limits (in bytes)
MAX_FILE_SIZE=104857600

# Optional: For health checks
PING_MESSAGE="pong"
```

### Development Server

```bash
# Start dev server (client + server on port 8080)
pnpm dev

# Or with npm
npm run dev
```

The application will be available at `http://localhost:8080`

### Build

```bash
# Build for production (both client and server)
pnpm build

# Build client only
pnpm build:client

# Build server only
pnpm build:server

# Start production server
pnpm start
```

### Database Commands

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database
pnpm db:push

# Run migrations
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio
```

### Other Commands

```bash
# Type checking
pnpm typecheck

# Run tests
pnpm test

# Format code
pnpm format.fix
```

---

## 🌐 Deployment

### Deployment Architecture

- **Frontend**: Netlify (React/Vite SPA)
- **Backend**: Render.com (Node.js/Express API)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (for multimedia files)

### Quick Deployment Guide (30 minutes)

#### Step 1: Set Up Supabase (10 min)

1. **Create Project**: Go to [supabase.com](https://supabase.com) → New Project
   - Project Name: `sype-ministry`
   - Save your database password!

2. **Get Database Connection String**: Settings → Database → Connection String (URI)
   ```
   postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

3. **Get API Keys**: Settings → API
   - Copy: Project URL, anon key, service_role key

4. **Create Storage Buckets**: Storage → New Bucket
   - Create `images` bucket (Public: ✅ Yes, File size: 50 MB)
   - Create `videos` bucket (Public: ✅ Yes, File size: 500 MB)
   - Create `documents` bucket (Public: ✅ Yes, File size: 100 MB)

#### Step 2: Deploy Backend on Render (10 min)

1. **Create Account**: [render.com](https://render.com) → Sign up with GitHub

2. **New Web Service**: Connect your `SYPE-Ministry` repository

3. **Configure**:
   - **Name**: `sype-ministry-api`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build:server && npx prisma generate`
   - **Start Command**: `node dist/server/node-build.mjs`
   - **Plan**: Free (or Starter for production)

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
   CONTACT_EMAIL=sypeministry@gmail.com
   CONTACT_PHONE=+250780430990
   PING_MESSAGE=pong
   ```

5. **Deploy**: Render will automatically deploy. Get your backend URL: `https://sype-ministry-api.onrender.com`

6. **Test Backend**:
   ```bash
   curl https://sype-ministry-api.onrender.com/health
   curl https://sype-ministry-api.onrender.com/api/ping
   ```

#### Step 3: Deploy Frontend on Netlify (5 min)

1. **In Netlify Dashboard**: Site Settings → Build & deploy
   - **Build command**: `npm run build:client`
   - **Publish directory**: `dist/client`
   - **Base directory**: `.` (root)

2. **Add Environment Variable**: Site Settings → Environment variables
   ```env
   VITE_API_BASE_URL=https://sype-ministry-api.onrender.com
   ```
   (Replace with your actual Render backend URL)

3. **Deploy**: Netlify will automatically deploy when you push to main branch. Get your frontend URL

#### Step 4: Update CORS (2 min)

After frontend is deployed, update Render backend environment variable:

1. Go to Render dashboard → Your service → **Environment**
2. Update `ALLOWED_ORIGINS`:
   ```env
   ALLOWED_ORIGINS=https://your-netlify-app.netlify.app,https://www.yourdomain.com
   ```
3. Save - Render will automatically redeploy

#### Step 5: Test Everything (3 min)

```bash
# Test backend health
curl https://sype-ministry-api.onrender.com/health

# Test API
curl https://sype-ministry-api.onrender.com/api/ping

# Visit frontend URL and check:
# - Site loads correctly
# - API calls work (check browser DevTools Network tab)
# - No CORS errors
# - Admin panel accessible
```

### Deployment Checklist

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
- [ ] Test file uploads

---

## 📦 Storage Architecture

### Where Data is Stored

#### Database (Supabase PostgreSQL)
Stores all structured data:
- Members, News Articles, Projects, Events
- Donations, FAQs, Committee Members
- Devotions, Email Subscribers
- Media File Metadata (references to storage URLs)

#### Multimedia Files (Supabase Storage)
Stored in public buckets:
- **`images/`** bucket: All images
  - `images/news/` - News article images
  - `images/projects/` - Project images
  - `images/members/` - Member profile photos
  - `images/committee/` - Committee member photos
  - `images/devotions/` - Devotion poster images
  - `images/posters/` - Poster images
  - `images/graphics/` - Graphics and design files
- **`videos/`** bucket: All videos
  - `videos/testimony/` - Testimony videos
  - `videos/featured/` - Featured videos
- **`documents/`** bucket: PDFs and documents
  - `documents/pdfs/` - PDF documents
  - `documents/files/` - Other documents

### How Upload Works

#### Development (Local Storage)
1. User uploads file via admin panel
2. File saved to `public/media/` or `public/images/` folder
3. URL returned: `/media/images/category/filename.jpg`
4. Files served by Express static middleware

#### Production (Supabase Storage)
1. User uploads file via admin panel
2. File received by backend (stored in memory temporarily)
3. File uploaded to Supabase Storage bucket
4. Supabase returns public CDN URL
5. URL saved to database/media metadata
6. Files served by Supabase CDN globally

### Accessing Files

**Development:**
```
http://localhost:8080/media/images/news/article.jpg
http://localhost:8080/images/devotions/poster.jpg
```

**Production:**
```
https://xxxxx.supabase.co/storage/v1/object/public/images/news/article.jpg
https://xxxxx.supabase.co/storage/v1/object/public/images/devotions/poster.jpg
```

### Storage Benefits

1. **CDN**: Files served globally via CDN (fast worldwide)
2. **Scalable**: Handles high traffic automatically
3. **Reliable**: 99.9% uptime SLA
4. **Secure**: Built-in access controls
5. **Simple**: Direct integration with database
6. **Free**: 1 GB free tier to start

### Storage Costs (Free Tier)

- **Storage**: 1 GB free
- **Bandwidth**: 2 GB/month free
- **File Upload Limit**: 50 MB per file (configurable per bucket)

---

## 🔌 API Endpoints

### Public Endpoints

```
GET  /api/ping                    - Health check
GET  /api/health                  - Health check with timestamp
GET  /api/committee               - Get active committee members
GET  /api/devotions?days=7        - Get devotions (last N days)
GET  /api/youtube/latest?limit=3  - Get latest YouTube videos
POST /api/subscribe               - Subscribe to newsletter
POST /api/unsubscribe             - Unsubscribe from newsletter
```

### Admin Endpoints

```
# Members
GET    /api/admin/members              - Get all members
POST   /api/admin/members              - Create member
PUT    /api/admin/members/:id          - Update member
DELETE /api/admin/members/:id          - Delete member

# News
GET    /api/admin/news?limit=3         - Get all news (with limit)
POST   /api/admin/news                 - Create news article
PUT    /api/admin/news/:id             - Update news article
DELETE /api/admin/news/:id             - Delete news article

# Projects
GET    /api/admin/projects             - Get all projects
POST   /api/admin/projects             - Create project
PUT    /api/admin/projects/:id         - Update project
DELETE /api/admin/projects/:id         - Delete project

# Events
GET    /api/admin/events               - Get all events
POST   /api/admin/events               - Create event
PUT    /api/admin/events/:id           - Update event
DELETE /api/admin/events/:id           - Delete event

# Donations
GET    /api/admin/donations            - Get all donations
POST   /api/admin/donations            - Create donation
PUT    /api/admin/donations/:id        - Update donation
DELETE /api/admin/donations/:id        - Delete donation

# Media
GET    /api/admin/media?category=posters&type=image - Get media files
POST   /api/admin/media                - Create media entry
PUT    /api/admin/media/:id            - Update media entry
DELETE /api/admin/media/:id            - Delete media entry

# Committee
GET    /api/admin/committee            - Get committee members
POST   /api/admin/committee            - Create committee member
PUT    /api/admin/committee/:id        - Update committee member
DELETE /api/admin/committee/:id        - Delete committee member

# Devotions
GET    /api/admin/devotions?days=7     - Get devotions
POST   /api/admin/devotions            - Create devotion
PUT    /api/admin/devotions/:id        - Update devotion
DELETE /api/admin/devotions/:id        - Delete devotion

# Analytics
GET    /api/admin/analytics            - Get dashboard analytics
```

### Upload Endpoints

```
POST /api/upload/image?category=news          - Upload single image
POST /api/upload/images?category=news         - Upload multiple images
POST /api/upload/media?category=posters&type=image - Upload media file
POST /api/upload/media/multiple              - Upload multiple media files
POST /api/upload/thumbnail                   - Upload video thumbnail
```

---

## 🔐 Admin Panel

The admin panel is accessible at `/admin` route.

### Admin Panel Features

- **Dashboard**: Analytics overview with key metrics
- **Member Management**: Full CRUD operations for members
- **News Management**: Create, edit, delete news articles with images
- **Project Management**: Manage projects with date-based filtering
- **Event Management**: Create and manage events with RSVP tracking
- **Donation Management**: Track donations with payment status (paid/unpaid/installment)
- **Media Management**: Upload and manage images, videos, documents
- **Book Management**: Manage library books with download tracking
- **Committee Management**: Manage committee members by category
- **Devotion Management**: Create and manage daily devotions
- **Email Subscribers**: Manage newsletter subscribers
- **FAQs Management**: Create and manage frequently asked questions

### Admin Authentication

Currently, the admin panel is accessible without authentication. For production, implement authentication (JWT, session-based, or Netlify Identity).

---

## 🆘 Troubleshooting

### Build Issues

**Backend build fails on Render:**
- Check build logs in Render dashboard
- Verify `build:server` script works locally: `npm run build:server`
- Check Node.js version (requires 18+)
- Verify all dependencies are in `package.json`

**Frontend build fails on Netlify:**
- Check build logs in Netlify dashboard
- Verify `build:client` script works locally: `npm run build:client`
- Check for TypeScript errors: `npm run typecheck`
- Verify output directory is `dist/client`

### Runtime Issues

**CORS Errors:**
- Verify `ALLOWED_ORIGINS` in backend includes your frontend URL (with `https://`)
- Check no trailing slashes in URLs
- Verify `VITE_API_BASE_URL` is set correctly in frontend environment variables
- Check browser console for exact CORS error message

**API Not Found (404):**
- Verify `VITE_API_BASE_URL` is set correctly in frontend
- Check backend is running (health check: `/health`)
- Verify API routes are deployed correctly
- Check browser DevTools Network tab for failed requests

**Database Connection Issues:**
- Verify `DATABASE_URL` is correct in backend environment variables
- Check database password is correct (no special character encoding issues)
- Verify Supabase database is accessible from Render
- Check Supabase dashboard for connection logs

**File Upload Issues:**
- Verify Supabase Storage buckets exist and are public
- Check `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Verify file size limits (check bucket settings in Supabase)
- Check browser console for upload errors

**Images/Videos Not Loading:**
- Verify storage buckets are public in Supabase
- Check file URLs are correct (Supabase Storage URLs)
- Verify CORS is configured for storage bucket
- Check browser console for 404 errors

### Development Issues

**Port already in use:**
```bash
# Kill process on port 8080 (Windows)
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or change port in .env
PORT=3000
```

**Dependencies not installing:**
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**TypeScript errors:**
```bash
# Run type check
pnpm typecheck

# Check tsconfig.json configuration
```

---

## 📊 System Architecture

### Component Flow

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Netlify)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Public     │  │    Admin     │  │   Components │  │
│  │   Pages      │  │   Dashboard  │  │              │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                  │                  │          │
│         └──────────────────┼──────────────────┘          │
│                            │                             │
│                    API Calls (fetch)                      │
└────────────────────────────┼─────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                  Backend (Render)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   API        │  │   Upload     │  │   YouTube    │  │
│  │   Routes     │  │   Handlers   │  │   Integration│  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                  │                  │          │
└─────────┼──────────────────┼──────────────────┼──────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│              Supabase (Database & Storage)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │   Storage    │  │    CDN       │  │
│  │   Database   │  │   Buckets    │  │   Delivery   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Request** → Frontend receives user interaction
2. **API Call** → Frontend makes fetch request to backend API
3. **Backend Processing** → Express handles request, processes data
4. **Database Query** → Backend queries Supabase PostgreSQL (if using Prisma)
5. **Storage Operation** → Backend uploads/downloads files from Supabase Storage
6. **Response** → Backend returns JSON response
7. **UI Update** → Frontend updates UI with response data

### Performance Optimization

- **CDN**: Static assets and media files served via Supabase CDN
- **Caching**: Browser caching for static assets
- **Lazy Loading**: Images and components loaded on demand
- **Code Splitting**: Route-based code splitting with React Router
- **Optimized Builds**: Minified and compressed production builds

---

## 🔧 Environment Variables Reference

### Backend (Render)

```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
YOUTUBE_API_KEY=your-youtube-api-key
ALLOWED_ORIGINS=https://your-netlify-app.netlify.app
SITE_URL=https://your-netlify-app.netlify.app
CONTACT_EMAIL=sypeministry@gmail.com
CONTACT_PHONE=+250780430990
MAX_FILE_SIZE=104857600
PING_MESSAGE=pong
```

### Frontend (Netlify)

```env
VITE_API_BASE_URL=https://sype-ministry-api.onrender.com
```

**Note**: If frontend and backend share the same domain, leave `VITE_API_BASE_URL` empty to use relative URLs.

---

## 📚 Key Files Reference

### Configuration Files
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Vite client build configuration
- `vite.config.server.ts` - Vite server build configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `prisma/schema.prisma` - Database schema
- `prisma.config.ts` - Prisma configuration

### Deployment Files
- `netlify.toml` - Netlify deployment configuration
- `render.yaml` - Render deployment configuration (alternative)
- `railway.json` - Railway deployment configuration (alternative)
- `Procfile` - Process file for Heroku/Railway

### Important Directories
- `client/` - Frontend React application
- `server/` - Backend Express API
- `public/` - Static assets (images, media files)
- `prisma/` - Database schema and migrations

---

## 🤝 Contributing

This is a private ministry website. For contributions or suggestions, please contact the ministry leadership.

---

## 📧 Contact Information

- **Email**: sypeministry@gmail.com
- **Phone**: +250 780 430 990 / +250 785 073 847
- **Location**: Kigali, Rwanda
- **YouTube**: [@sypeministry5276](https://www.youtube.com/@sypeministry5276)

---

## 📄 License

© 2024 SYPE Ministry. All rights reserved.

---

**Built with ❤️ for SYPE Ministry**

Last Updated: 2024
