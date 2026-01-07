import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Play, FileText, Image as ImageIcon, Video, CheckCircle2, Clock, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";
import ScrollAnimation, { StaggerContainer, HoverAnimation } from "@/components/ScrollAnimation";

export default function Projects() {

  const projects = [
    {
      category: "Documentary",
      name: "Final Global Crisis",
      topic: "Prophecy",
      description:
        "A series of 8-10 short documentaries (15-20 minutes) explaining prophecy from books of Daniel and Revelation, with focus on Sabbath and Sunday worship.",
      distribution: "Upload on YouTube, Facebook, and share on WhatsApp groups",
      type: "ongoing",
      year: "2020",
      featured: true,
    },
    {
      category: "Documentary",
      name: "USA in Prophecy",
      topic: "Prophecy",
      description:
        "Documentary series exploring the role of the USA in biblical prophecy and eschatology.",
      distribution: "Multiple digital platforms",
      type: "ongoing",
      year: "2020",
      featured: false,
    },
    {
      category: "Posters",
      name: "Bible Highlights from Genesis to Revelation",
      topic: "Evangelism",
      description:
        "Sharing highlights from bible verses and quotes covering the full biblical narrative from creation to redemption.",
      distribution:
        "Share on WhatsApp statuses and groups, Facebook, and elsewhere",
      type: "completed",
      year: "2021",
      featured: true,
    },
    {
      category: "Posters",
      name: "All About Sabbath",
      topic: "Gospel & Prophecy",
      description:
        "Happy Sabbath wishes and Bible truth about Sabbath with prophecy information.",
      distribution: "Share on WhatsApp statuses, Facebook, and other channels",
      type: "completed",
      year: "2021",
      featured: false,
    },
    {
      category: "Posters",
      name: "Councils on Nutrition and Foods",
      topic: "Health",
      description:
        "Sharing highlights articles from the book 'Councils on Nutrition and Foods' for health education and temperance promotion.",
      distribution: "Social media platforms and church groups",
      type: "ongoing",
      year: "2022",
      featured: false,
    },
    {
      category: "Articles",
      name: "Center of End Time",
      topic: "Prophecy",
      description:
        "Comprehensive tract describing the essential topics of Bible prophecy focusing on Sabbath and Sunday worship.",
      distribution: "Social media and door-to-door distribution",
      type: "completed",
      year: "2021",
      featured: false,
    },
    {
      category: "Articles",
      name: "Healthy in its Natural State",
      topic: "Health",
      description:
        "Educational tract showing that health is the right hand of Jesus Christ through the 3rd angel's message.",
      distribution: "Print and digital sharing",
      type: "completed",
      year: "2022",
      featured: true,
    },
    {
      category: "Articles",
      name: "The Path of Salvation in Sanctuary",
      topic: "Gospel",
      description:
        "Tract describing sanctuary images as the steps to the Gospel message.",
      distribution: "Various media and door-to-door outreach",
      type: "ongoing",
      year: "2023",
      featured: false,
    },
  ];

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

  const getStatusBadge = (type: string) => {
    if (type === "completed") {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Completed
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

  const featuredProjects = projects.filter(p => p.featured);
  const ongoingProjects = projects.filter(p => p.type === "ongoing");
  const completedProjects = projects.filter(p => p.type === "completed");

  const stats = [
    { label: "Total Projects", value: projects.length, icon: Award, color: "text-primary" },
    { label: "Ongoing", value: ongoingProjects.length, icon: Clock, color: "text-blue-600" },
    { label: "Completed", value: completedProjects.length, icon: CheckCircle2, color: "text-green-600" },
    { label: "Categories", value: 3, icon: TrendingUp, color: "text-secondary" },
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
      <section className="py-12 bg-white border-b border-border">
        <div className="container mx-auto px-4">
          <StaggerContainer
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            staggerDelay={0.2}
            direction="scale"
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              staggerDelay={0.3}
              direction="up"
            >
              {featuredProjects.map((project, idx) => (
                <HoverAnimation key={idx} scale={1.02} y={-8}>
                  <motion.div
                    whileHover={{ rotateY: 5, rotateX: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{ perspective: 1000 }}
                  >
                    <Card className="h-full border-2 hover:border-primary/50 hover:shadow-2xl transition-all group bg-gradient-to-br from-white to-primary/5">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          {getIcon(project.category)}
                        </div>
                        <div className="flex flex-col gap-2">
                          {getStatusBadge(project.type)}
                          <Badge variant="outline" className="text-xs">
                            {project.year}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-xl text-primary mb-2">
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
                    <CardContent>
                      <p className="text-foreground/80 text-sm leading-relaxed mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      <div className="pt-4 border-t border-border">
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
                {projects.map((project, idx) => (
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
                          {getStatusBadge(project.type)}
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
                {ongoingProjects.map((project, idx) => (
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
                          {getStatusBadge(project.type)}
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
                {completedProjects.map((project, idx) => (
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
                          {getStatusBadge(project.type)}
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
                {projects.filter(p => p.category === "Documentary").map((project, idx) => (
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
                          {getStatusBadge(project.type)}
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
                {projects.filter(p => p.category === "Posters").map((project, idx) => (
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
                          {getStatusBadge(project.type)}
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
