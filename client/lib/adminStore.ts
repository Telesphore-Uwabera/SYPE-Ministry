// Admin Data Store - Using localStorage for persistence
// In production, this would connect to a backend API

import { Member, NewsArticle, Project, Event, Donation, FAQ, MediaFile, EmailCampaign, Analytics } from "@/types/admin";

const STORAGE_KEYS = {
  MEMBERS: "sype_admin_members",
  NEWS: "sype_admin_news",
  PROJECTS: "sype_admin_projects",
  EVENTS: "sype_admin_events",
  DONATIONS: "sype_admin_donations",
  FAQS: "sype_admin_faqs",
  MEDIA: "sype_admin_media",
  CAMPAIGNS: "sype_admin_campaigns",
};

// Helper functions
const getFromStorage = <T>(key: string, defaultValue: T[]): T[] => {
  if (typeof window === "undefined") return defaultValue;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const saveToStorage = <T>(key: string, data: T[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize with sample data if empty
const initializeData = () => {
  if (getFromStorage(STORAGE_KEYS.MEMBERS, []).length === 0) {
    const sampleMembers: Member[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        phone: "+250 780 000 000",
        role: "Alumni",
        status: "Active",
        joinDate: "2023-01-15",
        department: "Media",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+250 781 000 000",
        role: "Student",
        status: "Active",
        joinDate: "2024-03-20",
        department: "Evangelism",
      },
    ];
    saveToStorage(STORAGE_KEYS.MEMBERS, sampleMembers);
  }
};

// Initialize on import
initializeData();

// Member Management
export const memberStore = {
  getAll: (): Member[] => getFromStorage(STORAGE_KEYS.MEMBERS, []),
  getById: (id: string): Member | undefined => {
    return memberStore.getAll().find((m) => m.id === id);
  },
  create: (member: Omit<Member, "id">): Member => {
    const members = memberStore.getAll();
    const newMember: Member = {
      ...member,
      id: Date.now().toString(),
    };
    members.push(newMember);
    saveToStorage(STORAGE_KEYS.MEMBERS, members);
    return newMember;
  },
  update: (id: string, updates: Partial<Member>): Member | null => {
    const members = memberStore.getAll();
    const index = members.findIndex((m) => m.id === id);
    if (index === -1) return null;
    members[index] = { ...members[index], ...updates };
    saveToStorage(STORAGE_KEYS.MEMBERS, members);
    return members[index];
  },
  delete: (id: string): boolean => {
    const members = memberStore.getAll();
    const filtered = members.filter((m) => m.id !== id);
    saveToStorage(STORAGE_KEYS.MEMBERS, filtered);
    return filtered.length < members.length;
  },
};

// News Management
export const newsStore = {
  getAll: (): NewsArticle[] => getFromStorage(STORAGE_KEYS.NEWS, []),
  getById: (id: string): NewsArticle | undefined => {
    return newsStore.getAll().find((n) => n.id === id);
  },
  create: (article: Omit<NewsArticle, "id" | "views">): NewsArticle => {
    const articles = newsStore.getAll();
    const newArticle: NewsArticle = {
      ...article,
      id: Date.now().toString(),
      views: 0,
    };
    articles.push(newArticle);
    saveToStorage(STORAGE_KEYS.NEWS, articles);
    return newArticle;
  },
  update: (id: string, updates: Partial<NewsArticle>): NewsArticle | null => {
    const articles = newsStore.getAll();
    const index = articles.findIndex((a) => a.id === id);
    if (index === -1) return null;
    articles[index] = { ...articles[index], ...updates };
    saveToStorage(STORAGE_KEYS.NEWS, articles);
    return articles[index];
  },
  delete: (id: string): boolean => {
    const articles = newsStore.getAll();
    const filtered = articles.filter((a) => a.id !== id);
    saveToStorage(STORAGE_KEYS.NEWS, filtered);
    return filtered.length < articles.length;
  },
};

// Project Management
export const projectStore = {
  getAll: (): Project[] => getFromStorage(STORAGE_KEYS.PROJECTS, []),
  getById: (id: string): Project | undefined => {
    return projectStore.getAll().find((p) => p.id === id);
  },
  create: (project: Omit<Project, "id">): Project => {
    const projects = projectStore.getAll();
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
    };
    projects.push(newProject);
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
    return newProject;
  },
  update: (id: string, updates: Partial<Project>): Project | null => {
    const projects = projectStore.getAll();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return null;
    projects[index] = { ...projects[index], ...updates };
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
    return projects[index];
  },
  delete: (id: string): boolean => {
    const projects = projectStore.getAll();
    const filtered = projects.filter((p) => p.id !== id);
    saveToStorage(STORAGE_KEYS.PROJECTS, filtered);
    return filtered.length < projects.length;
  },
};

// Event Management
export const eventStore = {
  getAll: (): Event[] => getFromStorage(STORAGE_KEYS.EVENTS, []),
  getById: (id: string): Event | undefined => {
    return eventStore.getAll().find((e) => e.id === id);
  },
  create: (event: Omit<Event, "id" | "rsvpCount" | "attendees">): Event => {
    const events = eventStore.getAll();
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
      rsvpCount: 0,
      attendees: [],
    };
    events.push(newEvent);
    saveToStorage(STORAGE_KEYS.EVENTS, events);
    return newEvent;
  },
  update: (id: string, updates: Partial<Event>): Event | null => {
    const events = eventStore.getAll();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) return null;
    events[index] = { ...events[index], ...updates };
    saveToStorage(STORAGE_KEYS.EVENTS, events);
    return events[index];
  },
  delete: (id: string): boolean => {
    const events = eventStore.getAll();
    const filtered = events.filter((e) => e.id !== id);
    saveToStorage(STORAGE_KEYS.EVENTS, filtered);
    return filtered.length < events.length;
  },
};

// Donation Management
export const donationStore = {
  getAll: (): Donation[] => getFromStorage(STORAGE_KEYS.DONATIONS, []),
  getById: (id: string): Donation | undefined => {
    return donationStore.getAll().find((d) => d.id === id);
  },
  create: (donation: Omit<Donation, "id">): Donation => {
    const donations = donationStore.getAll();
    const newDonation: Donation = {
      ...donation,
      id: Date.now().toString(),
    };
    donations.push(newDonation);
    saveToStorage(STORAGE_KEYS.DONATIONS, donations);
    return newDonation;
  },
  update: (id: string, updates: Partial<Donation>): Donation | null => {
    const donations = donationStore.getAll();
    const index = donations.findIndex((d) => d.id === id);
    if (index === -1) return null;
    donations[index] = { ...donations[index], ...updates };
    saveToStorage(STORAGE_KEYS.DONATIONS, donations);
    return donations[index];
  },
  delete: (id: string): boolean => {
    const donations = donationStore.getAll();
    const filtered = donations.filter((d) => d.id !== id);
    saveToStorage(STORAGE_KEYS.DONATIONS, filtered);
    return filtered.length < donations.length;
  },
};

// FAQ Management
export const faqStore = {
  getAll: (): FAQ[] => getFromStorage(STORAGE_KEYS.FAQS, []),
  getById: (id: string): FAQ | undefined => {
    return faqStore.getAll().find((f) => f.id === id);
  },
  create: (faq: Omit<FAQ, "id">): FAQ => {
    const faqs = faqStore.getAll();
    const newFAQ: FAQ = {
      ...faq,
      id: Date.now().toString(),
    };
    faqs.push(newFAQ);
    saveToStorage(STORAGE_KEYS.FAQS, faqs);
    return newFAQ;
  },
  update: (id: string, updates: Partial<FAQ>): FAQ | null => {
    const faqs = faqStore.getAll();
    const index = faqs.findIndex((f) => f.id === id);
    if (index === -1) return null;
    faqs[index] = { ...faqs[index], ...updates };
    saveToStorage(STORAGE_KEYS.FAQS, faqs);
    return faqs[index];
  },
  delete: (id: string): boolean => {
    const faqs = faqStore.getAll();
    const filtered = faqs.filter((f) => f.id !== id);
    saveToStorage(STORAGE_KEYS.FAQS, filtered);
    return filtered.length < faqs.length;
  },
};

// Media Management
export const mediaStore = {
  getAll: (): MediaFile[] => getFromStorage(STORAGE_KEYS.MEDIA, []),
  getById: (id: string): MediaFile | undefined => {
    return mediaStore.getAll().find((m) => m.id === id);
  },
  create: (file: Omit<MediaFile, "id">): MediaFile => {
    const files = mediaStore.getAll();
    const newFile: MediaFile = {
      ...file,
      id: Date.now().toString(),
    };
    files.push(newFile);
    saveToStorage(STORAGE_KEYS.MEDIA, files);
    return newFile;
  },
  update: (id: string, updates: Partial<MediaFile>): MediaFile | null => {
    const files = mediaStore.getAll();
    const index = files.findIndex((f) => f.id === id);
    if (index === -1) return null;
    files[index] = { ...files[index], ...updates };
    saveToStorage(STORAGE_KEYS.MEDIA, files);
    return files[index];
  },
  delete: (id: string): boolean => {
    const files = mediaStore.getAll();
    const filtered = files.filter((f) => f.id !== id);
    saveToStorage(STORAGE_KEYS.MEDIA, filtered);
    return filtered.length < files.length;
  },
};

// Email Campaign Management
export const campaignStore = {
  getAll: (): EmailCampaign[] => getFromStorage(STORAGE_KEYS.CAMPAIGNS, []),
  getById: (id: string): EmailCampaign | undefined => {
    return campaignStore.getAll().find((c) => c.id === id);
  },
  create: (campaign: Omit<EmailCampaign, "id">): EmailCampaign => {
    const campaigns = campaignStore.getAll();
    const newCampaign: EmailCampaign = {
      ...campaign,
      id: Date.now().toString(),
    };
    campaigns.push(newCampaign);
    saveToStorage(STORAGE_KEYS.CAMPAIGNS, campaigns);
    return newCampaign;
  },
  update: (id: string, updates: Partial<EmailCampaign>): EmailCampaign | null => {
    const campaigns = campaignStore.getAll();
    const index = campaigns.findIndex((c) => c.id === id);
    if (index === -1) return null;
    campaigns[index] = { ...campaigns[index], ...updates };
    saveToStorage(STORAGE_KEYS.CAMPAIGNS, campaigns);
    return campaigns[index];
  },
  delete: (id: string): boolean => {
    const campaigns = campaignStore.getAll();
    const filtered = campaigns.filter((c) => c.id !== id);
    saveToStorage(STORAGE_KEYS.CAMPAIGNS, filtered);
    return filtered.length < campaigns.length;
  },
};

// Analytics
export const getAnalytics = (): Analytics => {
  const members = memberStore.getAll();
  const projects = projectStore.getAll();
  const events = eventStore.getAll();
  const donations = donationStore.getAll();
  const news = newsStore.getAll();

  return {
    totalMembers: members.length,
    activeMembers: members.filter((m) => m.status === "Active").length,
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "ongoing").length,
    totalDonations: donations.length,
    totalDonationAmount: donations.reduce((sum, d) => sum + d.amount, 0),
    totalEvents: events.length,
    upcomingEvents: events.filter((e) => e.status === "upcoming").length,
    totalNewsArticles: news.length,
  };
};
