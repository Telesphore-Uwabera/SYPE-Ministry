import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  Video,
  Newspaper,
  DollarSign,
  Settings,
  BarChart3,
  Mail,
  Calendar,
  Image as ImageIcon,
  BookOpen,
  Shield,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MemberManagement from "@/components/admin/MemberManagement";
import NewsManagement from "@/components/admin/NewsManagement";
import ProjectManagement from "@/components/admin/ProjectManagement";
import EventManagement from "@/components/admin/EventManagement";
import DonationManagement from "@/components/admin/DonationManagement";
import FAQManagement from "@/components/admin/FAQManagement";
import MediaManagement from "@/components/admin/MediaManagement";
import Communication from "@/components/admin/Communication";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import SettingsManagement from "@/components/admin/Settings";
import { getAnalytics } from "@/lib/adminStore";

// Netlify Identity types
interface NetlifyUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface NetlifyIdentity {
  init: () => void;
  on: (event: string, callback: (user: NetlifyUser | null) => void) => void;
  currentUser: () => NetlifyUser | null;
  open: (modal: string) => void;
  close: () => void;
  logout: () => void;
}

declare global {
  interface Window {
    netlifyIdentity?: NetlifyIdentity;
  }
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<NetlifyUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useNetlifyIdentity, setUseNetlifyIdentity] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Check if Netlify Identity is available
    if (window.netlifyIdentity) {
      setUseNetlifyIdentity(true);
      window.netlifyIdentity.init();

      // Handle invite tokens in the URL hash
      const hash = window.location.hash;
      if (hash && hash.includes('invite_token')) {
        // Open signup modal to complete invitation
        window.netlifyIdentity.open('signup');
      }

      // Check current user
      const currentUser = window.netlifyIdentity.currentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }

      // Listen for login events
      window.netlifyIdentity.on("login", (user) => {
        setUser(user);
        setIsAuthenticated(true);
        window.netlifyIdentity?.close();
        // Clear invite token from URL after successful login
        if (window.location.hash.includes('invite_token')) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      });

      // Listen for signup events (when accepting invite)
      window.netlifyIdentity.on("signup", (user) => {
        setUser(user);
        setIsAuthenticated(true);
        window.netlifyIdentity?.close();
        // Clear invite token from URL after successful signup
        if (window.location.hash.includes('invite_token')) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      });

      // Listen for logout events
      window.netlifyIdentity.on("logout", () => {
        setUser(null);
        setIsAuthenticated(false);
      });
    }
    setIsLoading(false);
  }, []);

  // Fallback authentication (if Netlify Identity is not enabled)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder authentication - replace with real auth
    if (password === "Admin123") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid password");
    }
  };

  const handleLogout = () => {
    if (useNetlifyIdentity && window.netlifyIdentity) {
      window.netlifyIdentity.logout();
    } else {
      setIsAuthenticated(false);
      setPassword("");
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/50 to-background py-12">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-primary" />
                <CardTitle className="text-2xl">Admin Login</CardTitle>
              </div>
              <CardDescription>
                {useNetlifyIdentity
                  ? "Click the button below to login with Netlify Identity"
                  : "Enter your admin credentials to access the dashboard"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {useNetlifyIdentity ? (
                <div className="space-y-4">
                  <Button
                    onClick={() => window.netlifyIdentity?.open("login")}
                    className="w-full"
                  >
                    Login with Netlify Identity
                  </Button>
                  <p className="text-sm text-foreground/60 text-center">
                    Netlify Identity is enabled. Use your registered email to login.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter admin password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                  <p className="text-sm text-foreground/60 text-center">
                    To enable Netlify Identity, go to your Netlify dashboard → Identity → Enable Identity
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const adminFeatures = [
    {
      icon: Users,
      title: "Member Management",
      description: "Manage members, registrations, and member profiles",
      status: "planned",
      features: [
        "View all members",
        "Add/Edit/Delete members",
        "Member registration approval",
        "Member activity tracking",
        "Export member data",
      ],
    },
    {
      icon: FileText,
      title: "Content Management",
      description: "Manage website content, pages, and articles",
      status: "planned",
      features: [
        "Edit page content",
        "Manage news articles",
        "Update FAQs",
        "Manage library resources",
        "Content versioning",
      ],
    },
    {
      icon: Video,
      title: "Media Management",
      description: "Upload and manage videos, images, and multimedia",
      status: "planned",
      features: [
        "Upload videos to YouTube",
        "Manage video library",
        "Image gallery management",
        "Media file organization",
        "Bulk upload support",
      ],
    },
    {
      icon: Newspaper,
      title: "News & Announcements",
      description: "Create and manage news posts and announcements",
      status: "planned",
      features: [
        "Create news articles",
        "Schedule announcements",
        "News categories",
        "Featured news",
        "News analytics",
      ],
    },
    {
      icon: DollarSign,
      title: "Donation Management",
      description: "Track donations and financial contributions",
      status: "planned",
      features: [
        "View donation records",
        "Donation reports",
        "Donor management",
        "Financial summaries",
        "Export donation data",
      ],
    },
    {
      icon: Calendar,
      title: "Event Management",
      description: "Manage events, devotions, and ministry activities",
      status: "planned",
      features: [
        "Create events",
        "Event calendar",
        "RSVP management",
        "Event reminders",
        "Attendance tracking",
      ],
    },
    {
      icon: BookOpen,
      title: "Project Management",
      description: "Manage evangelical projects and initiatives",
      status: "planned",
      features: [
        "Create projects",
        "Project status tracking",
        "Team assignments",
        "Project timeline",
        "Project reports",
      ],
    },
    {
      icon: Mail,
      title: "Communication",
      description: "Send emails, newsletters, and announcements",
      status: "planned",
      features: [
        "Email campaigns",
        "Newsletter management",
        "Bulk messaging",
        "Email templates",
        "Communication logs",
      ],
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "View website analytics and ministry statistics",
      status: "planned",
      features: [
        "Website traffic analytics",
        "Member statistics",
        "Donation reports",
        "Project progress",
        "Custom reports",
      ],
    },
    {
      icon: Settings,
      title: "Settings",
      description: "Configure website settings and preferences",
      status: "planned",
      features: [
        "Site configuration",
        "User permissions",
        "Email settings",
        "Social media links",
        "Backup & restore",
      ],
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-muted/50 to-background py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-heading font-bold text-4xl text-primary mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-foreground/70">
                  Manage SYPE Ministry website content and operations
                </p>
              </div>
              <div className="flex items-center gap-4">
                {user && (
                  <div className="text-sm text-foreground/70">
                    <p className="font-semibold">{user.email}</p>
                    {user.user_metadata?.full_name && (
                      <p className="text-xs">{user.user_metadata.full_name}</p>
                    )}
                  </div>
                )}
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {(() => {
              const stats = getAnalytics();
              return (
                <>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total Members</CardDescription>
                      <CardTitle className="text-3xl">{stats.totalMembers}</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Active Projects</CardDescription>
                      <CardTitle className="text-3xl">{stats.activeProjects}</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total Donations</CardDescription>
                      <CardTitle className="text-3xl">{stats.totalDonations}</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>News Articles</CardDescription>
                      <CardTitle className="text-3xl">{stats.totalNewsArticles}</CardTitle>
                    </CardHeader>
                  </Card>
                </>
              );
            })()}
          </div>

          {/* Admin Features */}
          <Tabs defaultValue="analytics" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="donations">Donations</TabsTrigger>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="members">
              <MemberManagement />
            </TabsContent>

            <TabsContent value="news">
              <NewsManagement />
            </TabsContent>

            <TabsContent value="projects">
              <ProjectManagement />
            </TabsContent>

            <TabsContent value="events">
              <EventManagement />
            </TabsContent>

            <TabsContent value="donations">
              <DonationManagement />
            </TabsContent>

            <TabsContent value="faqs">
              <FAQManagement />
            </TabsContent>

            <TabsContent value="media">
              <MediaManagement />
            </TabsContent>

            <TabsContent value="communication">
              <Communication />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsManagement />
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </Layout>
  );
}

