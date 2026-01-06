# SYPE Ministry Website

A modern, production-ready website for SYPE (Seventh-day Adventist Young Professionals in Evangelism) - a ministry equipping young professionals for evangelism through talents, professions, and service.

## 🌟 Overview

SYPE Ministry is a full-stack web application built to serve the Seventh-day Adventist Young Professionals in Evangelism community. The website provides information about the ministry, membership opportunities, resources, and facilitates engagement with the community.

**Live Website:** [https://sypeministry.netlify.app](https://sypeministry.netlify.app)

## 🚀 Tech Stack

- **Frontend**: React 18 + React Router 6 (SPA) + TypeScript + Vite
- **Styling**: TailwindCSS 3 + Radix UI components
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Backend**: Express.js (integrated with Vite dev server)
- **Package Manager**: PNPM
- **Testing**: Vitest
- **Deployment**: Netlify

## 📁 Project Structure

```
SYPE Ministry/
├── client/                   # React SPA frontend
│   ├── pages/                # Route components
│   │   ├── Home.tsx          # Homepage
│   │   ├── About.tsx         # About page with FAQs
│   │   ├── Membership.tsx    # Membership information
│   │   ├── Donations.tsx     # Donation page
│   │   ├── Contact.tsx       # Contact page
│   │   ├── FAQs.tsx          # FAQs page
│   │   ├── Devotions.tsx     # Weekly devotion program
│   │   ├── Projects.tsx       # Evangelical projects
│   │   ├── Departments.tsx   # Ministry departments
│   │   ├── Terms.tsx         # Terms and Conditions
│   │   ├── Privacy.tsx       # Privacy Policy
│   │   ├── Cookies.tsx       # Cookies Policy
│   │   └── ...
│   ├── components/           # Reusable components
│   │   ├── Layout.tsx        # Main layout wrapper
│   │   ├── Navigation.tsx    # Navigation bar
│   │   ├── Footer.tsx        # Footer component
│   │   ├── BackToTop.tsx     # Back to top button
│   │   ├── SEO.tsx           # SEO meta tags component
│   │   └── ui/               # UI component library
│   ├── App.tsx               # App entry point with routing
│   └── global.css            # TailwindCSS styles
│
├── server/                   # Express API backend
│   ├── index.ts              # Server setup
│   └── routes/               # API route handlers
│
├── shared/                   # Shared types
│   └── api.ts                # API interfaces
│
├── public/                   # Static assets
│   ├── Sype logo.png         # Logo image
│   ├── sitemap.xml           # SEO sitemap
│   └── robots.txt            # SEO robots file
│
└── index.html                # HTML entry point
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
- Home page with hero section and ministry overview
- About page with history, mission, and FAQs
- Membership page with eligibility and benefits
- Donations page with support options
- Contact page with multiple contact methods
- Devotions page with weekly program details
- Projects page showcasing evangelical initiatives
- Departments page with organizational structure
- Library, News, and Videos pages (placeholders)

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- PNPM (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Or with npm
npm install
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
# Build for production
pnpm build

# Start production server
pnpm start
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

## 📝 Environment Variables

Create a `.env` file in the root directory (if needed):

```env
# Server configuration
PORT=8080

# Add other environment variables as needed
```

## 🔐 Admin Panel

The admin panel is accessible at `/admin` (authentication required).

### Admin Panel Features (Planned)

The admin panel will include the following functionalities:

#### 1. **Member Management**
- View all members with search and filters
- Add/Edit/Delete member profiles
- Approve/reject member registrations
- Track member activity and engagement
- Export member data (CSV/Excel)
- Member role management (Student/Alumni/Admin)

#### 2. **Content Management**
- Edit page content (Home, About, etc.)
- Manage news articles (CRUD operations)
- Update FAQs dynamically
- Manage library resources
- Content versioning and history
- Rich text editor for content

#### 3. **Media Management**
- Upload videos and link to YouTube
- Manage video library with categories
- Image gallery management
- File organization and tagging
- Bulk upload support
- Media file optimization

#### 4. **News & Announcements**
- Create and publish news articles
- Schedule announcements
- News categories and tags
- Featured news management
- News analytics (views, engagement)
- Draft and publish workflow

#### 5. **Donation Management**
- View donation records
- Generate donation reports
- Donor management
- Financial summaries and analytics
- Export donation data
- Receipt generation

#### 6. **Event Management**
- Create and manage events
- Event calendar view
- RSVP management
- Send event reminders
- Attendance tracking
- Event categories

#### 7. **Project Management**
- Create evangelical projects
- Track project status
- Assign team members
- Project timeline management
- Project reports and analytics
- Project categories and tags

#### 8. **Communication**
- Email campaign management
- Newsletter creation and sending
- Bulk messaging to members
- Email templates
- Communication logs
- Scheduled emails

#### 9. **Analytics & Reports**
- Website traffic analytics
- Member statistics dashboard
- Donation reports and charts
- Project progress tracking
- Custom report generation
- Export capabilities

#### 10. **Settings**
- Site configuration
- User permissions and roles
- Email service settings
- Social media links management
- Backup and restore functionality
- System logs

### Implementation Roadmap

**Phase 1: Core Features**
- Authentication system (JWT-based)
- Database integration (PostgreSQL/MongoDB)
- Member management CRUD operations
- Basic content management

**Phase 2: Content Management**
- News article management
- Media library with file upload
- FAQ management
- Page content editor

**Phase 3: Advanced Features**
- Donation tracking and reporting
- Event management system
- Email campaign system
- Analytics dashboard

## 🌐 Deployment

### Netlify Deployment

The site is configured for Netlify deployment:

1. Connect your GitHub repository to Netlify
2. Build command: `pnpm build`
3. Publish directory: `dist/spa`
4. The site will auto-deploy on push to main branch

### Manual Deployment

```bash
# Build the project
pnpm build

# Deploy the dist/spa directory to your hosting provider
```

## 📧 Contact Information

- **Email**: sypeministry@gmail.com
- **Phone**: +250 780 430 990 / +250 785 073 847
- **Location**: Kigali, Rwanda
- **YouTube**: [@sypeministry5276](https://www.youtube.com/@sypeministry5276)

## 📄 License

© 2024 SYPE Ministry. All rights reserved.

## 🤝 Contributing

This is a private ministry website. For contributions or suggestions, please contact the ministry leadership.

---

**Built with ❤️ for SYPE Ministry**

