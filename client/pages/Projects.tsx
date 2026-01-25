import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Play, FileText, Image as ImageIcon, Video, CheckCircle2, Clock, TrendingUp, Award, Filter } from "lucide-react";
import { motion } from "framer-motion";
import ScrollAnimation, { StaggerContainer, HoverAnimation } from "@/components/ScrollAnimation";
import { useEffect, useState } from "react";
import { Event, Project } from "@/types/admin";
import { buildApiUrl } from "@/lib/apiConfig";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<"all" | "past" | "ongoing" | "future">("all");

  useEffect(() => {
    fetchProjects();
    fetchEvents();
  }, []);

  const fetchProjects = async () => {
    try {
      const apiUrl = buildApiUrl("/api/projects");
      console.log("Fetching projects from:", apiUrl);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Projects data received:", data);

      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        console.warn("Projects data is not an array:", data);
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const apiUrl = buildApiUrl("/api/events?limit=6");
      const response = await fetch(apiUrl, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log("Events data received:", data);
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };


  const getIcon = (category: string) => {
    switch (category) {
      case "Documentary":
        return <Video className="w-6 h-6" />;
      case "Posters":
        return <ImageIcon className="w-6 h-6" />;
      case "Articles":
        return <FileText className="w-6 h-6" />;
      default:
        return <Play className="w-6 h-6" />;
    }
  };

  const getBadgeColor = (topic: string) => {
    switch (topic) {
      case "Prophecy":
        return "bg-primary/20 text-primary border-primary/30";
      case "Gospel & Prophecy":
        return "bg-secondary/20 text-secondary border-secondary/30";
      case "Health":
        return "bg-accent/30 text-accent-foreground border-accent/40";
      case "Gospel":
        return "bg-primary/20 text-primary border-primary/30";
      case "Evangelism":
        return "bg-secondary/20 text-secondary border-secondary/30";
      default:
        return "bg-muted text-foreground border-border";
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "completed") {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    }
    if (status === "planned") {
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-300">
          <Clock className="w-3 h-3 mr-1" />
          Planned
        </Badge>
      );
    }
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-300">
        <Clock className="w-3 h-3 mr-1" />
        Ongoing
      </Badge>
    );
  };

  // Filter projects by date
  const getFilteredProjects = () => {
    let filtered = [...projects];

    if (dateFilter === "past") {
      // Projects with endDate in the past or completed status
      filtered = filtered.filter((p) => {
        if (p.status === "completed") return true;
        if (p.endDate) {
          return new Date(p.endDate) < new Date();
        }
        return false;
      });
    } else if (dateFilter === "ongoing") {
      // Projects that are currently ongoing (startDate <= today <= endDate OR status = ongoing)
      filtered = filtered.filter((p) => {
        if (p.status === "ongoing") return true;
        if (p.startDate && p.endDate) {
          const today = new Date();
          const start = new Date(p.startDate);
          const end = new Date(p.endDate);
          return today >= start && today <= end;
        }
        if (p.startDate) {
          return new Date(p.startDate) <= new Date();
        }
        return false;
      });
    } else if (dateFilter === "future") {
      // Projects with startDate in the future or planned status
      filtered = filtered.filter((p) => {
        if (p.status === "planned") return true;
        if (p.startDate) {
          return new Date(p.startDate) > new Date();
        }
        return false;
      });
    }

    return filtered;
  };

  const filteredProjects = getFilteredProjects();
  const featuredProjects = filteredProjects.filter(p => p.featured);
  const ongoingProjects = filteredProjects.filter(p => p.status === "ongoing");
  const completedProjects = filteredProjects.filter(p => p.status === "completed");

  // Calculate unique categories
  const uniqueCategories = new Set(projects.map(p => p.category)).size;

  const stats = [
    { label: "Total Projects", value: projects.length, icon: Award, color: "text-primary" },
    { label: "Ongoing", value: ongoingProjects.length, icon: Clock, color: "text-blue-600" },
    { label: "Completed", value: completedProjects.length, icon: CheckCircle2, color: "text-green-600" },
    { label: "Categories", value: uniqueCategories, icon: TrendingUp, color: "text-secondary" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-secondary to-primary py-16 md:py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            className="font-heading font-bold text-4xl md:text-5xl mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Evangelical Projects
          </motion.h1>
          <motion.p
            className="text-lg opacity-90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Discover our diverse evangelical initiatives producing impactful
            content to spread the Gospel
          </motion.p>
        </div>
      </section>

      {/* Statistics Section */}
      {!loading && (
        <section className="py-12 bg-white border-b border-border">
          <div className="container mx-auto px-4">
            <StaggerContainer
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
              staggerDelay={0.2}
              direction="scale"
              detectScrollDirection
            >
              {stats.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                  <HoverAnimation key={idx} scale={1.05} y={-5}>
                    <motion.div
                      whileHover={{ rotateY: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="text-center border-2 hover:border-primary/50 hover:shadow-xl transition-all bg-gradient-to-br from-white to-primary/5">
                        <CardContent className="pt-6">
                          <motion.div
                            className="flex justify-center mb-3"
                            whileHover={{ rotate: 360, scale: 1.2 }}
                            transition={{ duration: 0.6 }}
                          >
                            <motion.div
                              className={`p-3 bg-primary/10 rounded-lg ${stat.color}`}
                              whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
                            >
                              <IconComponent className="w-6 h-6" />
                            </motion.div>
                          </motion.div>
                          <motion.div
                            className="text-3xl font-heading font-bold text-primary mb-1"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              type: "spring",
                              stiffness: 200,
                              delay: idx * 0.1,
                            }}
                          >
                            {stat.value}
                          </motion.div>
                          <div className="text-sm text-foreground/70 font-medium">
                            {stat.label}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </HoverAnimation>
                );
              })}
            </StaggerContainer>
          </div>
        </section>
      )}

      {loading && (
        <section className="py-12 bg-white border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events Section */}
      <section className="py-16 md:py-20 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="up" delay={0.2}>
            <div className="mb-8">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-2">
                Upcoming Events
              </h2>
              <p className="text-foreground/70">
                Join us in upcoming programs and ministry activities
              </p>
            </div>
          </ScrollAnimation>

          {eventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-10 text-foreground/70">
              No upcoming events yet.
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.15} direction="up" detectScrollDirection>
              {events.map((event) => (
                <HoverAnimation key={event.id} scale={1.02} y={-6}>
                  <Link to={`/events/${event.id}`} className="block h-full">
                    <Card className="h-full border-2 hover:border-primary/50 hover:shadow-lg transition-all">
                      <CardHeader>
                        <CardTitle className="text-lg text-primary line-clamp-2">
                          {event.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {new Date(event.date).toLocaleDateString()} • {event.time} • {event.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground/80 text-sm leading-relaxed line-clamp-3 mb-3">
                          {event.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {event.category}
                          </Badge>
                          <Button asChild size="sm" variant="outline" className="pointer-events-none">
                            <span>Read More</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </HoverAnimation>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="py-16 md:py-24 bg-gradient-to-br from-accent/10 via-background to-secondary/10">
          <div className="container mx-auto px-4">
            <ScrollAnimation direction="up" delay={0.2}>
              <div className="mb-8">
                <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-2">
                  Featured Projects
                </h2>
                <p className="text-foreground/70">
                  Highlighted initiatives making significant impact in evangelism
                </p>
              </div>
            </ScrollAnimation>
            <StaggerContainer
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
              staggerDelay={0.3}
              direction="up"
            >
              {featuredProjects.map((project, idx) => (
                <HoverAnimation key={idx} scale={1.02} y={-8}>
                  <motion.div
                    className="h-full"
                    whileHover={{ rotateY: 5, rotateX: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{ perspective: 1000 }}
                  >
                    <Card className="h-full flex flex-col border-2 hover:border-primary/50 hover:shadow-2xl transition-all group bg-gradient-to-br from-white to-primary/5">
                      <CardHeader className="flex-shrink-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            {getIcon(project.category)}
                          </div>
                          <div className="flex flex-col gap-2">
                            {getStatusBadge(project.status)}
                            <Badge variant="outline" className="text-xs">
                              {project.year}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="text-xl text-primary mb-2 min-h-[56px]">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Badge className={`${getBadgeColor(project.topic)} text-xs`}>
                            {project.topic}
                          </Badge>
                          <span className="text-xs">•</span>
                          <span className="text-xs">{project.category}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col min-h-0">
                        <p className="text-foreground/80 text-sm leading-relaxed mb-4 flex-1 min-h-[100px]">
                          {project.description}
                        </p>
                        <div className="pt-4 border-t border-border mt-auto flex-shrink-0">
                          <p className="text-xs text-foreground/60">
                            <span className="font-semibold">Distribution:</span>{" "}
                            <span className="text-foreground/70">{project.distribution}</span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </HoverAnimation>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {loading && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 text-center">
            <p className="text-foreground/70">Loading projects...</p>
          </div>
        </section>
      )}

      {!loading && projects.length === 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 text-center">
            <p className="text-foreground/70">No projects available yet.</p>
          </div>
        </section>
      )}

      {/* All Projects with Tabs */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-2">
              All Projects
            </h2>
            <p className="text-foreground/70">
              Browse all our evangelical initiatives by status or category
            </p>
          </div>

          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Filter className="w-4 h-4" />
                <span>Filter by date:</span>
              </div>
              <Tabs value={dateFilter} onValueChange={(value) => setDateFilter(value as "all" | "past" | "ongoing" | "future")} className="w-auto">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                  <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                  <TabsTrigger value="future">Future</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="documentary">Documentary</TabsTrigger>
              <TabsTrigger value="posters">Posters</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.map((project, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                  >
                    <Card className="h-full border-2 hover:border-primary/50 hover:shadow-lg transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="p-3 bg-primary/10 rounded-lg">
                              {getIcon(project.category)}
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg text-primary mb-1">
                                {project.name}
                              </CardTitle>
                              <CardDescription>{project.category} • {project.year}</CardDescription>
                            </div>
                          </div>
                          {getStatusBadge(project.status)}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={`${getBadgeColor(project.topic)} text-xs`}>
                            {project.topic}
                          </Badge>
                          {project.featured && (
                            <Badge variant="outline" className="text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground/80 text-sm leading-relaxed mb-4">
                          {project.description}
                        </p>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs">
                            <span className="font-semibold text-foreground">Distribution:</span>{" "}
                            <span className="text-foreground/70">{project.distribution}</span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ongoing" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.filter(p => p.status === "ongoing").map((project, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                  >
                    <Card className="h-full border-2 hover:border-primary/50 hover:shadow-lg transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="p-3 bg-primary/10 rounded-lg">
                              {getIcon(project.category)}
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg text-primary mb-1">
                                {project.name}
                              </CardTitle>
                              <CardDescription>{project.category} • {project.year}</CardDescription>
                            </div>
                          </div>
                          {getStatusBadge(project.status)}
                        </div>
                        <Badge className={`${getBadgeColor(project.topic)} text-xs`}>
                          {project.topic}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground/80 text-sm leading-relaxed mb-4">
                          {project.description}
                        </p>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs">
                            <span className="font-semibold text-foreground">Distribution:</span>{" "}
                            <span className="text-foreground/70">{project.distribution}</span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.filter(p => p.status === "completed").map((project, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                  >
                    <Card className="h-full border-2 hover:border-primary/50 hover:shadow-lg transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="p-3 bg-primary/10 rounded-lg">
                              {getIcon(project.category)}
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg text-primary mb-1">
                                {project.name}
                              </CardTitle>
                              <CardDescription>{project.category} • {project.year}</CardDescription>
                            </div>
                          </div>
                          {getStatusBadge(project.status)}
                        </div>
                        <Badge className={`${getBadgeColor(project.topic)} text-xs`}>
                          {project.topic}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground/80 text-sm leading-relaxed mb-4">
                          {project.description}
                        </p>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs">
                            <span className="font-semibold text-foreground">Distribution:</span>{" "}
                            <span className="text-foreground/70">{project.distribution}</span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="documentary" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.filter(p => p.category === "Documentary").map((project, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                  >
                    <Card className="h-full border-2 hover:border-primary/50 hover:shadow-lg transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="p-3 bg-primary/10 rounded-lg">
                              {getIcon(project.category)}
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg text-primary mb-1">
                                {project.name}
                              </CardTitle>
                              <CardDescription>{project.category} • {project.year}</CardDescription>
                            </div>
                          </div>
                          {getStatusBadge(project.status)}
                        </div>
                        <Badge className={`${getBadgeColor(project.topic)} text-xs`}>
                          {project.topic}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground/80 text-sm leading-relaxed mb-4">
                          {project.description}
                        </p>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs">
                            <span className="font-semibold text-foreground">Distribution:</span>{" "}
                            <span className="text-foreground/70">{project.distribution}</span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="posters" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProjects.filter(p => p.category === "Posters").map((project, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                  >
                    <Card className="h-full border-2 hover:border-primary/50 hover:shadow-lg transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="p-3 bg-primary/10 rounded-lg">
                              {getIcon(project.category)}
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg text-primary mb-1">
                                {project.name}
                              </CardTitle>
                              <CardDescription>{project.category} • {project.year}</CardDescription>
                            </div>
                          </div>
                          {getStatusBadge(project.status)}
                        </div>
                        <Badge className={`${getBadgeColor(project.topic)} text-xs`}>
                          {project.topic}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground/80 text-sm leading-relaxed mb-4">
                          {project.description}
                        </p>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs">
                            <span className="font-semibold text-foreground">Distribution:</span>{" "}
                            <span className="text-foreground/70">{project.distribution}</span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Project Submission Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-8">
            Project Submission Process
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-semibold text-primary">Submit Proposal</p>
                <p className="text-foreground/70 text-sm">
                  Any SYPE member can submit a project proposal
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-semibold text-primary">Committee Review</p>
                <p className="text-foreground/70 text-sm">
                  Committee approves and discusses the proposed project
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-semibold text-primary">Member Enrollment</p>
                <p className="text-foreground/70 text-sm">
                  Members volunteer for projects that match their interests
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-semibold text-primary">Production</p>
                <p className="text-foreground/70 text-sm">
                  Selected team produces the project with excellence
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                5
              </div>
              <div>
                <p className="font-semibold text-primary">Review & Feedback</p>
                <p className="text-foreground/70 text-sm">
                  Committee reviews completed project (6 hours) and members
                  provide feedback (12 hours)
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                6
              </div>
              <div>
                <p className="font-semibold text-primary">Distribution</p>
                <p className="text-foreground/70 text-sm">
                  Share across WhatsApp groups, Facebook, YouTube, websites, and
                  all available channels
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-6">
            Making an Impact
          </h2>
          <p className="text-foreground/70 text-lg leading-relaxed mb-8">
            Through diverse projects in documentaries, posters, and articles,
            SYPE Ministry is reaching thousands with the Gospel message. Each
            project is designed with careful planning, professional execution,
            and strategic distribution to maximize impact across digital and
            traditional platforms.
          </p>
          <p className="text-foreground/70 text-lg leading-relaxed mb-8">
            Every SYPE member can contribute their unique talents and
            professions to make these projects successful and bring the message
            of Christ to more people.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-semibold rounded-lg"
            >
              <Link to="/membership">Join Our Projects</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-black text-black hover:bg-black hover:text-white px-8 py-6 text-base font-semibold rounded-lg"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
