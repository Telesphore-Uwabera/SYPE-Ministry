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
  amount: number;
  currency: string;
  date: string;
  type: "one-time" | "monthly" | "project-based";
  projectId?: string;
  paymentMethod?: string;
  receiptSent: boolean;
  notes?: string;
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
  size: number;
  uploadDate: string;
  category?: string;
  tags?: string[];
  description?: string;
}

export interface EmailCampaign {
  id: string;
  subject: string;
  body: string;
  recipients: string[];
  sentDate?: string;
  status: "draft" | "scheduled" | "sent";
  scheduledDate?: string;
  openRate?: number;
  clickRate?: number;
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
  websiteViews?: number;
}
