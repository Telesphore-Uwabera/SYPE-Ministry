import { useState } from "react";
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
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  // TODO: Implement proper authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder authentication - replace with real auth
    if (password === "admin123") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid password");
    }
  };

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
                Enter your admin credentials to access the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
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
              </form>
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
              <Button
                variant="outline"
                onClick={() => setIsAuthenticated(false)}
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Members</CardDescription>
                <CardTitle className="text-3xl">150+</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active Projects</CardDescription>
                <CardTitle className="text-3xl">25+</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Media Resources</CardDescription>
                <CardTitle className="text-3xl">100+</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>News Articles</CardDescription>
                <CardTitle className="text-3xl">0</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Admin Features */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Features</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                        </div>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-muted text-xs rounded">
                              {feature.status}
                            </span>
                          </div>
                          <ul className="text-sm text-foreground/70 space-y-1 mt-3">
                            {feature.features.slice(0, 3).map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                            {feature.features.length > 3 && (
                              <li className="text-primary text-xs">
                                +{feature.features.length - 3} more features
                              </li>
                            )}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="content">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminFeatures
                  .filter((f) =>
                    ["Content Management", "Media Management", "News & Announcements"].includes(
                      f.title
                    )
                  )
                  .map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <IconComponent className="w-5 h-5 text-primary" />
                            </div>
                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                          </div>
                          <CardDescription>{feature.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm text-foreground/70 space-y-1">
                            {feature.features.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </TabsContent>

            <TabsContent value="members">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminFeatures
                  .filter((f) => f.title === "Member Management")
                  .map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <IconComponent className="w-5 h-5 text-primary" />
                            </div>
                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                          </div>
                          <CardDescription>{feature.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm text-foreground/70 space-y-1">
                            {feature.features.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminFeatures
                  .filter((f) => f.title === "Analytics & Reports")
                  .map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <IconComponent className="w-5 h-5 text-primary" />
                            </div>
                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                          </div>
                          <CardDescription>{feature.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm text-foreground/70 space-y-1">
                            {feature.features.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </TabsContent>
          </Tabs>

          {/* Implementation Notes */}
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Implementation Roadmap</CardTitle>
              <CardDescription>
                The following features are planned for implementation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-primary mb-2">Phase 1: Core Features</h3>
                  <ul className="text-sm text-foreground/70 space-y-1 list-disc list-inside">
                    <li>Authentication system (JWT-based)</li>
                    <li>Database integration (PostgreSQL/MongoDB)</li>
                    <li>Member management CRUD operations</li>
                    <li>Basic content management</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">Phase 2: Content Management</h3>
                  <ul className="text-sm text-foreground/70 space-y-1 list-disc list-inside">
                    <li>News article management</li>
                    <li>Media library with file upload</li>
                    <li>FAQ management</li>
                    <li>Page content editor</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">Phase 3: Advanced Features</h3>
                  <ul className="text-sm text-foreground/70 space-y-1 list-disc list-inside">
                    <li>Donation tracking and reporting</li>
                    <li>Event management system</li>
                    <li>Email campaign system</li>
                    <li>Analytics dashboard</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

