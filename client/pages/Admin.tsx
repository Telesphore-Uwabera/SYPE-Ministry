import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
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
    );
  }

  return (
    <AdminLayout user={user} onLogout={handleLogout}>
      <div className="min-h-screen bg-gradient-to-br from-muted/50 to-background py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4">
              <h1 className="font-heading font-bold text-4xl text-primary mb-2">
                Admin Dashboard
              </h1>
              <p className="text-foreground/70">
                Manage SYPE Ministry website content and operations
              </p>
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
    </AdminLayout>
  );
}

