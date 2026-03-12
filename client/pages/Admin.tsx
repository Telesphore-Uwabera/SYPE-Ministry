import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  BarChart3,
  Users,
  Newspaper,
  FolderKanban,
  Calendar,
  DollarSign,
  HelpCircle,
  BookOpen,
  BookMarked,
  UsersRound,
  Mail,
  Settings,
  Menu,
} from "lucide-react";
import { buildApiUrl } from "@/lib/apiConfig";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MemberManagement from "@/components/admin/MemberManagement";
import NewsManagement from "@/components/admin/NewsManagement";
import ProjectManagement from "@/components/admin/ProjectManagement";
import EventManagement from "@/components/admin/EventManagement";
import DonationManagement from "@/components/admin/DonationManagement";
import FAQManagement from "@/components/admin/FAQManagement";
import BookManagement from "@/components/admin/BookManagement";
import Communication from "@/components/admin/Communication";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import SettingsManagement from "@/components/admin/Settings";
import CommitteeManagement from "@/components/admin/CommitteeManagement";
import DevotionManagement from "@/components/admin/DevotionManagement";

export default function Admin() {
  const [activeSection, setActiveSection] = useState("analytics");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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

  useEffect(() => {
    if (!isAuthenticated) return;
    const handler = () => loadAnalytics();
    window.addEventListener("admin-data-changed", handler);
    return () => window.removeEventListener("admin-data-changed", handler);
  }, [isAuthenticated]);

  const loadAnalytics = async () => {
    try {
      const response = await fetch(buildApiUrl("/api/admin/analytics"));
      const data = await response.json();
      if (data) {
        console.log("Analytics data refreshed:", data);
        setAnalytics({
          totalMembers: data.totalMembers || 0,
          activeMembers: data.activeMembers || 0,
          totalProjects: data.totalProjects || 0,
          activeProjects: data.activeProjects || 0,
          totalDonations: data.totalDonations || 0,
          totalDonationAmount: data.totalDonationAmount || 0,
          totalEvents: data.totalEvents || 0,
          upcomingEvents: data.upcomingEvents || 0,
          totalNewsArticles: data.totalNewsArticles || 0,
          totalBooks: data.totalBooks || 0,
          totalSubscribers: data.totalSubscribers || 0,
          activeSubscribers: data.activeSubscribers || 0,
        });
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

  // Sidebar menu items
  const menuItems = [
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "members", label: "Members", icon: Users },
    { id: "news", label: "News", icon: Newspaper },
    { id: "projects", label: "Projects", icon: FolderKanban },
    { id: "events", label: "Events", icon: Calendar },
    { id: "donations", label: "Donations", icon: DollarSign },
    { id: "faqs", label: "FAQs", icon: HelpCircle },
    { id: "books", label: "Books", icon: BookOpen },
    { id: "devotions", label: "Devotions", icon: BookMarked },
    { id: "committee", label: "Committee", icon: UsersRound },
    { id: "communication", label: "Communication", icon: Mail },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Sidebar component
  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-4 border-b">
          <div className="flex items-center gap-3 mb-3">
          <img
            src="/Images/sype-logo.webp"
            alt="SYPE Ministry Logo"
            className="w-10 h-10 object-contain"
          />
        </div>
        <h2 className="font-heading font-bold text-lg text-primary">Navigation</h2>
      </div>

      {/* Sidebar Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                // Close mobile sidebar when a link is clicked
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeSection === item.id
                ? "bg-primary text-primary-foreground"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );

  // Mobile sidebar (sheet)
  const mobileSidebar = (
    <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        {sidebar}
      </SheetContent>
    </Sheet>
  );

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "analytics":
        return <AnalyticsDashboard analytics={analytics} onRefresh={loadAnalytics} />;
      case "members":
        return <MemberManagement />;
      case "news":
        return <NewsManagement />;
      case "projects":
        return <ProjectManagement />;
      case "events":
        return <EventManagement />;
      case "donations":
        return <DonationManagement />;
      case "faqs":
        return <FAQManagement />;
      case "books":
        return <BookManagement />;
      case "devotions":
        return <DevotionManagement />;
      case "committee":
        return <CommitteeManagement />;
      case "communication":
        return <Communication />;
      case "settings":
        return <SettingsManagement />;
      default:
        return <AnalyticsDashboard analytics={analytics} onRefresh={loadAnalytics} />;
    }
  };

  return (
    <AdminLayout user={adminUser} onLogout={handleLogout} sidebar={sidebar}>
      <div className="min-h-screen bg-gradient-to-br from-muted/50 to-background py-12">
        <div className="container mx-auto px-4">
          {/* Header with Mobile Menu */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {mobileSidebar}
                <h1 className="font-heading font-bold text-4xl text-primary">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-foreground/70">
                Manage SYPE Ministry website content and operations
              </p>
            </div>
          </div>



          {/* Admin Features Content */}
          <div className="space-y-4">
            {renderContent()}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

