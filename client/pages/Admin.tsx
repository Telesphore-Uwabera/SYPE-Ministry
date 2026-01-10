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
import BookManagement from "@/components/admin/BookManagement";
import Communication from "@/components/admin/Communication";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import SettingsManagement from "@/components/admin/Settings";
import CommitteeManagement from "@/components/admin/CommitteeManagement";
import DevotionManagement from "@/components/admin/DevotionManagement";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalProjects: 0,
    activeProjects: 0,
    totalDonations: 0,
    totalDonationAmount: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    totalNewsArticles: 0,
    totalBooks: 0,
    totalSubscribers: 0,
    activeSubscribers: 0,
  });

  useEffect(() => {
    // Check if already authenticated (stored in sessionStorage)
    const authStatus = sessionStorage.getItem("admin_authenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      loadAnalytics();
    }
    setIsLoading(false);
  }, [isAuthenticated]);

  const loadAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics");
      const data = await response.json();
      if (data) {
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simple authentication: Username "SYPE Ministry" and Password "Admin123"
    const validUsername = "SYPE Ministry";
    const validPassword = "Admin123";

    if (username.trim() === validUsername && password === validPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_authenticated", "true");
      setUsername("");
      setPassword("");
    } else {
      setError("Invalid username or password");
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_authenticated");
    setUsername("");
    setPassword("");
    setError("");
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
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter username"
                  required
                  autoComplete="username"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Create a simple user object for AdminLayout
  const adminUser = {
    id: "admin",
    email: "sypeministry@gmail.com",
    user_metadata: {
      full_name: "SYPE Ministry Admin",
    },
  };

  return (
    <AdminLayout user={adminUser} onLogout={handleLogout}>
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
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Members</CardDescription>
                <CardTitle className="text-3xl">{analytics.totalMembers}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active Projects</CardDescription>
                <CardTitle className="text-3xl">{analytics.activeProjects}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Donations</CardDescription>
                <CardTitle className="text-3xl">{analytics.totalDonations}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>News Articles</CardDescription>
                <CardTitle className="text-3xl">{analytics.totalNewsArticles}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Admin Features */}
          <Tabs defaultValue="analytics" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:grid-cols-7 gap-1 overflow-x-auto">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="donations">Donations</TabsTrigger>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
              <TabsTrigger value="books">Books</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="devotions">Devotions</TabsTrigger>
              <TabsTrigger value="committee">Committee</TabsTrigger>
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

            <TabsContent value="books">
              <BookManagement />
            </TabsContent>

            <TabsContent value="media">
              <MediaManagement />
            </TabsContent>

            <TabsContent value="devotions">
              <DevotionManagement />
            </TabsContent>

            <TabsContent value="committee">
              <CommitteeManagement />
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

