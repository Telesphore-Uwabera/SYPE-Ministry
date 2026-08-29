// Admin Panel Types and Interfaces

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "Student" | "Alumni" | "Admin";
  status: "Active" | "Inactive" | "Pending";
  joinDate: string;
  department?: string;
  association?: string;
  notes?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  author: string;
  publishDate: string;
  excerpt: string;
  body: string;
  image?: string;
  featured: boolean;
  category?: string;
  tags?: string[];
  views?: number;
}

export interface Project {
  id: string;
  name: string;
  category: "Documentary" | "Posters" | "Articles";
  topic: string;
  description: string;
  distribution: string;
  status: "ongoing" | "completed" | "planned";
  year: string;
  featured?: boolean;
  teamMembers?: string[];
  startDate?: string;
  endDate?: string;
  budget?: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  rsvpRequired: boolean;
  rsvpCount?: number;
  maxAttendees?: number;
  attendees?: string[];
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
}

export interface Donation {
  id: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  amount: number;
  amountPaid?: number; // For installments: amount received so far
  currency: string;
  date: string;
  type: "one-time" | "monthly" | "project-based";
  projectId?: string;
  paymentMethod?: string;
  paymentStatus?: "paid" | "unpaid" | "installment";
  paymentDeadline?: string;
  receiptSent: boolean;
  notes?: string;
}

export interface Devotion {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content?: string;
  image?: string;
  featuredVideoUrl?: string;
  featuredVideoThumbnail?: string;
  featuredVideoTitle?: string;
  createdAt?: string;
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
}

export interface MediaFile {
  id: string;
  name: string;
  type: "image" | "video" | "document";
  url: string;
  thumbnail?: string;
  youtubeUrl?: string; // YouTube link for featured videos
  size: number;
  uploadDate: string;
  category?: string;
  tags?: string[];
  description?: string;
}

export interface EmailSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  status: "active" | "unsubscribed";
  source?: string; // Where they subscribed from (e.g., "footer", "contact_form")
  tags?: string[];
}

export interface EmailCampaign {
  id: string;
  subject: string;
  body: string;
  recipients: string[];
  sentDate?: string;
  status: "draft" | "scheduled" | "sent" | "sending";
  scheduledDate?: string;
  openRate?: number;
  clickRate?: number;
}

export interface Book {
  id: string;
  title: string;
  author?: string;
  category: "Health" | "Genzura" | "Ellen G. White Books" | "Bible" | "Inyandiko" | "Integuza" | "Others";
  description?: string;
  coverImage?: string;
  fileUrl?: string; // PDF or document URL
  isbn?: string;
  publisher?: string;
  publishDate?: string;
  language?: string;
  pages?: number;
  tags?: string[];
  featured: boolean;
  uploadDate: string;
  downloads?: number;
}

export interface CommitteeMember {
  id: string;
  position: string;
  name: string;
  church: string;
  phone: string;
  category: "leadership" | "team" | "auditor" | "asa_representatives" | "board_counsellors"; // For grouping on About page
  image?: string; // URL to member photo
  email?: string;
  order: number; // For sorting within category
  active: boolean; // To show/hide members
}

export interface Analytics {
  totalMembers: number;
  activeMembers: number;
  totalProjects: number;
  activeProjects: number;
  totalDonations: number;
  totalDonationAmount: number;
  totalEvents: number;
  upcomingEvents: number;
  totalNewsArticles: number;
  totalBooks?: number;
  totalSubscribers?: number;
  activeSubscribers?: number;
  totalCommitteeMembers?: number;
  activeCommitteeMembers?: number;
  totalDevotions?: number;
  totalContactSubmissions?: number;
  newContactSubmissions?: number;
  websiteViews?: number;
}
