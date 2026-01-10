# SYPE Ministry - System Architecture

## Overview

This document explains how the admin panel, client-side, backend, and database work together for optimal performance.

## System Components

### 1. **Client-Side (React + TypeScript + Vite)**

**Location**: `client/` directory

**Purpose**: 
- Public-facing website for users
- Admin dashboard for content management

**Key Features**:
- React Router for navigation
- Tailwind CSS + Radix UI for styling
- Framer Motion for animations
- Fetch API for backend communication

**Public Pages**:
- `Home.tsx` - Landing page with latest content
- `About.tsx` - About SYPE, committee members
- `Projects.tsx` - Display projects
- `Donations.tsx` - Donation form and information
- `Contact.tsx` - Contact form and information
- `Videos.tsx` - Videos & Multimedia (YouTube + admin-uploaded)
- `Library.tsx` - Digital library (books)
- `News.tsx` - News articles
- `Departments.tsx` - Department information

**Admin Components**:
- `Admin.tsx` - Main admin dashboard
- `MemberManagement.tsx` - Manage members
- `ProjectManagement.tsx` - Manage projects
- `NewsManagement.tsx` - Manage news articles
- `EventManagement.tsx` - Manage events
- `DonationManagement.tsx` - View/manage donations
- `MediaManagement.tsx` - Upload/manage media files
- `BookManagement.tsx` - Manage library books
- `CommitteeManagement.tsx` - Manage committee members
- `Communication.tsx` - Email subscribers and campaigns

### 2. **Backend (Express.js + TypeScript)**

**Location**: `server/` directory

**Purpose**:
- RESTful API endpoints
- File upload handling
- Business logic
- Data validation

**Key Files**:
- `server/index.ts` - Main Express server setup
- `server/routes/admin.ts` - Admin API endpoints (CRUD operations)
- `server/routes/upload.ts` - Image upload endpoints
- `server/routes/mediaUpload.ts` - Media file upload endpoints
- `server/routes/youtube.ts` - YouTube API integration
- `server/lib/upload.ts` - Image upload configuration (Multer)
- `server/lib/mediaUpload.ts` - Media upload configuration (Multer)
- `server/lib/prisma.ts` - Database client (for future database integration)

**API Endpoints**:

**Admin Endpoints** (require authentication in production):
```
GET    /api/admin/members              - Get all members
POST   /api/admin/members              - Create member
PUT    /api/admin/members/:id          - Update member
DELETE /api/admin/members/:id          - Delete member

GET    /api/admin/news                 - Get all news (supports ?limit=3)
POST   /api/admin/news                 - Create news article
PUT    /api/admin/news/:id             - Update news article
DELETE /api/admin/news/:id             - Delete news article

GET    /api/admin/projects             - Get all projects
POST   /api/admin/projects             - Create project
PUT    /api/admin/projects/:id         - Update project
DELETE /api/admin/projects/:id         - Delete project

GET    /api/admin/events               - Get all events
POST   /api/admin/events               - Create event
PUT    /api/admin/events/:id           - Update event
DELETE /api/admin/events/:id           - Delete event

GET    /api/admin/donations            - Get all donations
POST   /api/admin/donations            - Create donation (also used by public form)
PUT    /api/admin/donations/:id        - Update donation
DELETE /api/admin/donations/:id        - Delete donation

GET    /api/admin/faqs                 - Get all FAQs
POST   /api/admin/faqs                 - Create FAQ
PUT    /api/admin/faqs/:id             - Update FAQ
DELETE /api/admin/faqs/:id             - Delete FAQ

GET    /api/admin/media                - Get all media (supports ?category=testimony&type=video)
POST   /api/admin/media                - Create media record
PUT    /api/admin/media/:id            - Update media
DELETE /api/admin/media/:id            - Delete media

GET    /api/admin/books                - Get all books (supports ?category=Bible&search=...)
POST   /api/admin/books                - Create book
PUT    /api/admin/books/:id            - Update book
DELETE /api/admin/books/:id            - Delete book
POST   /api/admin/books/:id/download   - Track book download

GET    /api/admin/committee            - Get all committee members
POST   /api/admin/committee            - Create committee member
PUT    /api/admin/committee/:id        - Update committee member
DELETE /api/admin/committee/:id        - Delete committee member

GET    /api/admin/subscribers          - Get all email subscribers
GET    /api/admin/subscribers/:id      - Get subscriber by ID
PUT    /api/admin/subscribers/:id      - Update subscriber
DELETE /api/admin/subscribers/:id      - Delete subscriber

GET    /api/admin/analytics            - Get dashboard analytics
```

**Public Endpoints**:
```
GET    /api/committee                  - Get active committee members (public)
GET    /api/youtube/videos             - Get YouTube videos (supports ?category=sermons&limit=6)
POST   /api/subscribe                  - Subscribe to email list (public)
POST   /api/unsubscribe                - Unsubscribe from email list (public)
```

**Upload Endpoints**:
```
POST   /api/upload/image               - Upload single image (supports ?category=news)
POST   /api/upload/images              - Upload multiple images
POST   /api/upload/media               - Upload media file (image/video/document) (supports ?category=testimony&type=video)
POST   /api/upload/media/multiple      - Upload multiple media files
POST   /api/upload/thumbnail           - Upload video thumbnail
```

**Static File Serving**:
```
GET    /images/:category/:filename     - Serve uploaded images
GET    /media/:type/:filename          - Serve uploaded media files
```

### 3. **Database (PostgreSQL via Prisma ORM)**

**Location**: `prisma/schema.prisma`

**Purpose**:
- Store all application data
- Relationships between entities
- Data validation at database level

**Current Status**: 
- Schema defined but using in-memory arrays (ready for database migration)
- To migrate: Run `npx prisma migrate dev` or `npx prisma db push`

**Tables** (from schema):
- `members` - Ministry members
- `news_articles` - News articles and announcements
- `projects` - Evangelical projects
- `events` - Ministry events
- `donations` - Donation records
- `faqs` - Frequently asked questions
- `media_files` - Uploaded media (images, videos, documents)
- `books` - Library books
- `email_subscribers` - Email subscription list
- `email_campaigns` - Email campaign records

### 4. **File Storage**

**Location**: `public/` directory (committed to GitHub)

**Structure**:
```
public/
├── images/
│   ├── news/           - News article images
│   ├── projects/       - Project images
│   ├── members/        - Member photos
│   ├── events/         - Event images
│   ├── media/          - General media images
│   └── committee/      - Committee member photos
├── media/
│   ├── images/
│   │   ├── graphics/   - Graphics for Videos page
│   │   └── posters/    - Posters for Videos page
│   ├── videos/
│   │   └── testimony/  - Testimony videos
│   ├── documents/      - Document files
│   └── thumbnails/     - Video thumbnails
└── Sype logo.png       - Site logo
```

**How it works**:
1. Admin uploads file via admin panel
2. Backend (Multer) saves file to appropriate `public/` subdirectory
3. File path is stored in database as URL (e.g., `/images/news/image.jpg`)
4. Client-side requests file via static file serving
5. Files are committed to GitHub for version control

## Data Flow Examples

### Example 1: Admin Creates a Project

```
1. Admin opens Admin Panel → Projects tab
2. Clicks "Add Project" button
3. Fills form (name, category, topic, description, status, etc.)
4. Clicks "Create Project"
5. Frontend: ProjectManagement.tsx → POST /api/admin/projects (JSON payload)
6. Backend: server/routes/admin.ts → createProject handler
   - Validates required fields
   - Generates unique ID
   - Adds to `projects` array (in-memory, will be database later)
   - Returns project object with ID
7. Frontend: Receives response → Shows success toast
8. Frontend: Refetches projects list → Displays new project in table
9. Public Page: Projects.tsx fetches from /api/admin/projects → Displays on website
```

### Example 2: User Submits Donation Form

```
1. User visits /donations page
2. Clicks "Make a Donation" button
3. DonationForm component appears
4. User fills form (name, email, amount, type, payment method, etc.)
5. Clicks "Submit Donation Form"
6. Frontend: DonationForm.tsx → POST /api/admin/donations (JSON payload)
7. Backend: server/routes/admin.ts → createDonation handler
   - Validates required fields (name, email, amount, type)
   - Converts date to ISO string
   - Adds to `donations` array
   - Returns donation object
8. Frontend: Shows success toast → Resets form
9. Admin: Can view donation in DonationManagement.tsx
   - Fetches from GET /api/admin/donations
   - Displays in table
   - Can mark receipt as sent
   - Can edit/delete donation
```

### Example 3: Admin Uploads Media (Video)

```
1. Admin opens Media Management tab
2. Selects category: "Testimony"
3. Selects type: "Video"
4. Clicks upload area or "Select Files"
5. Selects video file (MP4, MOV, etc.)
6. Frontend: MediaManagement.tsx → POST /api/upload/media?category=testimony&type=video
   - Sends FormData with file
7. Backend: server/routes/mediaUpload.ts → uploadMedia handler
   - Multer receives file
   - Saves to public/media/videos/testimony/
   - Returns URL: /media/videos/testimony/filename.mp4
8. Frontend: Receives URL → Creates media record
   - POST /api/admin/media with metadata (name, type, url, category, size)
9. Backend: Adds to `media` array
10. Public Page: Videos.tsx → Fetches GET /api/admin/media?category=testimony&type=video
    - Displays video in "Testimonies" tab
```

### Example 4: Display Latest News on Homepage

```
1. User visits homepage (/)
2. Home.tsx component loads
3. useEffect: Fetches GET /api/admin/news?limit=3
4. Backend: server/routes/admin.ts → getNews handler
   - Filters/limits results
   - Sorts by publishDate (newest first)
   - Returns 3 latest news articles
5. Frontend: Receives array → Displays in LatestNewsCards component
6. Each card shows: image, title, excerpt, date, "Read More" link
```

## Performance Optimization Strategies

### 1. **Client-Side Optimization**

**Code Splitting**:
- Lazy load admin components
- Split routes for better initial load time

**Caching**:
- Use React Query or SWR for API response caching
- Cache YouTube API responses (already implemented with 1-hour cache)

**Image Optimization**:
- Lazy load images below the fold
- Use responsive images (srcset)
- Compress images before upload

### 2. **Backend Optimization**

**Database Indexing** (when migrated to PostgreSQL):
```sql
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_year ON projects(year);
CREATE INDEX idx_news_publish_date ON news_articles(publish_date);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_media_category_type ON media_files(category, type);
```

**Pagination**:
```typescript
// Add to all list endpoints
const page = parseInt(req.query.page as string) || 1;
const limit = parseInt(req.query.limit as string) || 10;
const skip = (page - 1) * limit;

// Return paginated results
res.json({
  data: result.slice(skip, skip + limit),
  total: result.length,
  page,
  limit,
  totalPages: Math.ceil(result.length / limit)
});
```

**Response Caching**:
- Use Redis for frequently accessed data
- Cache YouTube API responses (already implemented)
- Cache static content (CDN)

### 3. **Database Optimization**

**Connection Pooling**:
- Use Supabase connection pooling URL
- Limit concurrent connections

**Query Optimization**:
- Use Prisma select to fetch only needed fields
- Implement proper indexes
- Use database views for complex queries

**Data Archiving**:
- Archive old donations, events after 2 years
- Soft delete instead of hard delete

### 4. **File Storage Optimization**

**CDN Integration** (Production):
- Upload files to CloudFlare CDN, Cloudinary, or AWS S3
- Serve files from CDN for faster load times
- GitHub as backup/version control

**Image Optimization**:
- Compress on upload (Sharp library)
- Generate multiple sizes (thumbnail, medium, large)
- Use WebP format for better compression

## Security Considerations

### 1. **Authentication** (Current: Simple, Production: Recommended)

**Current Implementation**:
- Simple username/password in sessionStorage
- Username: "SYPE Ministry"
- Password: "Admin123"

**Production Recommendations**:
- JWT tokens with refresh tokens
- Password hashing (bcrypt)
- Rate limiting on login endpoint
- Two-factor authentication (optional)

### 2. **API Security**

- Validate all inputs (server-side)
- Sanitize user inputs
- Implement CORS restrictions (production)
- Rate limiting on API endpoints
- API key authentication for admin endpoints

### 3. **File Upload Security**

- Validate file types (MIME types)
- Limit file sizes (5MB images, 200MB videos)
- Scan for viruses (ClamAV)
- Sanitize filenames
- Store files outside web root (optional, but we store in public/ for GitHub)

### 4. **Database Security**

- Use parameterized queries (Prisma handles this)
- Database credentials in environment variables only
- Regular backups
- Access control at database level

## Deployment Architecture

### Recommended Stack

```
┌─────────────────────────────────────────────────────────┐
│              Domain (Name.com)                          │
│              sypeministry.org                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ DNS → CDN (Optional)
                     │
┌────────────────────▼────────────────────────────────────┐
│              Frontend (Netlify/Vercel)                  │
│  - React app (client/)                                  │
│  - Static assets                                        │
│  - Server-Side Rendering (if needed)                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ API Calls (HTTPS)
                     │
┌────────────────────▼────────────────────────────────────┐
│              Backend (Node.js on Railway/Render)        │
│  - Express.js server (server/)                          │
│  - API endpoints                                        │
│  - File upload handling                                 │
│  - Business logic                                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Database Queries
                     │
┌────────────────────▼────────────────────────────────────┐
│              Database (Supabase PostgreSQL)             │
│  - All tables (members, projects, news, etc.)           │
│  - Automatic backups                                    │
│  - Connection pooling                                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              File Storage                               │
│  Option 1: GitHub (current)                             │
│    - Committed to repository                            │
│    - Version controlled                                 │
│                                                         │
│  Option 2: Supabase Storage (recommended for prod)      │
│    - Scalable                                           │
│    - CDN included                                       │
│    - Better performance                                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              External Services                          │
│  - YouTube API (for fetching videos)                    │
│  - Email Service (optional, for notifications)          │
└─────────────────────────────────────────────────────────┘
```

## Why Books Are Separate from Media

### Conceptual Differences

**Books (Library Management)**:
- **Purpose**: Permanent digital library resources
- **Usage**: Users download PDFs/EPUBs for offline reading
- **Lifecycle**: Long-term resources, rarely removed
- **Metadata**: Rich metadata (ISBN, publisher, language, pages)
- **Features**: Download tracking, featured books, categories
- **Organization**: By subject categories (Bible, Health, etc.)
- **Example**: "The Great Controversy" book - permanent resource

**Media (Media Management)**:
- **Purpose**: Visual content for website display
- **Usage**: Displayed on Videos & Multimedia page
- **Lifecycle**: Temporary/promotional content, can be replaced
- **Metadata**: Basic metadata (name, category, description)
- **Features**: Thumbnails, preview, categories for display
- **Organization**: By content type (testimony, graphics, posters)
- **Example**: Event poster image - promotional content

### Technical Differences

| Aspect | Books | Media |
|--------|-------|-------|
| Storage | `public/media/documents/` or separate | `public/media/images/`, `public/media/videos/` |
| File Types | PDF, EPUB, DOC | Images (JPEG, PNG), Videos (MP4, MOV), Documents (PDF) |
| Download Tracking | Yes (downloads counter) | No (views only) |
| Categories | Subject-based (Bible, Health) | Content-based (testimony, graphics) |
| Featured | Yes (featured books on homepage) | No (displayed by category) |
| Display Page | Library page | Videos & Multimedia page |
| Admin Component | BookManagement | MediaManagement |

### Why Separation is Better

1. **Clear Purpose**: Books are for download, Media is for display
2. **Better Organization**: Different categorization systems
3. **Separate Features**: Download tracking for books, thumbnails for media
4. **Scalability**: Can optimize storage differently
5. **User Experience**: Users find what they need faster
6. **Admin Management**: Easier to manage with separate interfaces

## Best Practices for Working Together

### 1. **Admin Creates Content**
- Use admin panel to create/edit/delete all content
- All changes immediately reflect on public site
- Admin can preview before publishing

### 2. **Client-Side Fetches Data**
- Public pages fetch from public API endpoints
- Use `limit` query params to fetch only needed data
- Implement pagination for large lists

### 3. **Backend Validates Everything**
- Never trust client-side validation alone
- Validate all inputs server-side
- Sanitize user inputs
- Return clear error messages

### 4. **Database as Single Source of Truth**
- All data stored in database (when migrated)
- In-memory arrays are temporary (for development)
- Database ensures data persistence across restarts

### 5. **File Storage Strategy**
- Small files (< 1MB): Commit to GitHub
- Large files (> 1MB): Use Supabase Storage or CDN
- Always store file paths in database, not files themselves

### 6. **Error Handling**
- Frontend: Show user-friendly error messages
- Backend: Log errors, return structured error responses
- Database: Use transactions for multi-step operations

### 7. **Performance Monitoring**
- Track API response times
- Monitor database query performance
- Track file upload sizes and durations
- Monitor error rates

## Future Enhancements

1. **Database Migration**: Move from in-memory arrays to PostgreSQL
2. **Caching Layer**: Add Redis for frequently accessed data
3. **CDN**: Use CDN for media files in production
4. **Image Optimization**: Auto-compress and resize images
5. **Search**: Add full-text search (PostgreSQL tsvector or Algolia)
6. **Real-time Updates**: WebSockets for live notifications
7. **Export Features**: CSV/PDF export for reports
8. **Backup Automation**: Automated daily backups
9. **Monitoring**: Error tracking (Sentry), analytics (Google Analytics)
10. **Email Notifications**: Automated emails for donations, subscriptions
