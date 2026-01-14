import { useState, useEffect } from "react";
import { Analytics } from "@/types/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, BookOpen, DollarSign, Calendar, Newspaper } from "lucide-react";
import { buildApiUrl } from "@/lib/apiConfig";

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const apiUrl = buildApiUrl("/api/admin/analytics");
      console.log("Fetching analytics from:", apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Analytics data received:", data);
      
      if (data) {
        // Ensure all required fields have default values
        const analyticsData = {
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
          totalCommitteeMembers: data.totalCommitteeMembers || 0,
          activeCommitteeMembers: data.activeCommitteeMembers || 0,
          totalDevotions: data.totalDevotions || 0,
          totalContactSubmissions: data.totalContactSubmissions || 0,
          newContactSubmissions: data.newContactSubmissions || 0,
        };
        console.log("Setting analytics:", analyticsData);
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
      // Set default values on error
      setAnalytics({
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
        totalCommitteeMembers: 0,
        activeCommitteeMembers: 0,
        totalDevotions: 0,
        totalContactSubmissions: 0,
        newContactSubmissions: 0,
      });
    }
  };

  if (!analytics) {
    return <div>Loading analytics...</div>;
  }

  const stats = [
    {
      title: "Total Members",
      value: analytics.totalMembers,
      description: `${analytics.activeMembers} active`,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Projects",
      value: analytics.totalProjects,
      description: `${analytics.activeProjects} ongoing`,
      icon: BookOpen,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Donations",
      value: analytics.totalDonations,
      description: `${(analytics.totalDonationAmount || 0).toLocaleString()} RWF`,
      icon: DollarSign,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Total Events",
      value: analytics.totalEvents,
      description: `${analytics.upcomingEvents} upcoming`,
      icon: Calendar,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "News Articles",
      value: analytics.totalNewsArticles,
      description: "Published articles",
      icon: Newspaper,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Analytics & Reports</h2>
          <p className="text-foreground/70">Ministry statistics and insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>Overview of ministry activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-foreground/70">Active Members</span>
              <span className="font-semibold">
                {analytics.activeMembers} / {analytics.totalMembers}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground/70">Ongoing Projects</span>
              <span className="font-semibold">
                {analytics.activeProjects} / {analytics.totalProjects}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground/70">Total Donation Amount</span>
              <span className="font-semibold">{(analytics.totalDonationAmount || 0).toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground/70">Upcoming Events</span>
              <span className="font-semibold">
                {analytics.upcomingEvents} / {analytics.totalEvents}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
