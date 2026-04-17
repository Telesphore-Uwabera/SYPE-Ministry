import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import {
  Target,
  Rocket,
  Sprout,
  Users,
  BookOpen,
  Play,
  Newspaper,
  Heart,
  MessageCircle,
  Clock,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";
import ScrollAnimation, { StaggerContainer, HoverAnimation } from "@/components/ScrollAnimation";
import { useEffect, useMemo, useState } from "react";
import { NewsArticle, Devotion, Event } from "@/types/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildApiUrl } from "@/lib/apiConfig";
import { LazySection } from "@/components/LazySections";
import { LoadingState } from "@/components/ui/LoadingState";

// YouTube Video interface
interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  description: string;
  videoId: string;
}

// Latest News Cards Component
function LatestNewsCards() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchNews = async (forceFresh = false) => {
      try {
        const res = await fetch(buildApiUrl("/api/news?limit=3"), {
          cache: forceFresh ? "no-store" : "default",
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (!isMounted) return;
        const sortedNews = (Array.isArray(data) ? data : []).sort(
          (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        );
        setNews(sortedNews.slice(0, 3));
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchNews();
    const interval = window.setInterval(() => {
      fetchNews(true);
    }, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <LoadingState message="Loading news..." icon={Newspaper} />;
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <Newspaper className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
        <p className="text-foreground/70">No news articles available yet.</p>
      </div>
    );
  }

  return (
    <StaggerContainer detectScrollDirection className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.2} direction="up">
      {news.map((article) => (
        <HoverAnimation key={article.id} scale={1.02} y={-8} className="h-full">
          <Link to={`/news/${article.id}`} className="block h-full">
            <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
              {article.image ? (
                <div className="relative h-48 overflow-hidden bg-muted/10">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Newspaper className="w-16 h-16 text-primary opacity-40" />
                </div>
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-xs">
                  <Calendar className="w-3 h-3" />
                  {new Date(article.publishDate).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-sm text-foreground/70 line-clamp-3 mb-4">{article.excerpt}</p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full pointer-events-none mt-auto"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    Read More
                    <Newspaper className="w-3 h-3" />
                  </span>
                </Button>
              </CardContent>
            </Card>
          </Link>
        </HoverAnimation>
      ))}
    </StaggerContainer>
  );
}

// Latest Devotions Cards Component
function LatestDevotionsCards() {
  const [devotions, setDevotions] = useState<Devotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDevotions = async (forceFresh = false) => {
      try {
        const apiUrl = buildApiUrl("/api/devotions?limit=3");
        const res = await fetch(apiUrl, {
          cache: forceFresh ? "no-store" : "default",
        });

        if (!res.ok) {
          console.error(`HTTP error! status: ${res.status}`);
          return;
        }

        const data = await res.json();

        const devotionsData = (Array.isArray(data) ? data : [])
          .sort((a: Devotion, b: Devotion) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3);
        if (!isMounted) return;
        setDevotions(devotionsData);
      } catch (error) {
        console.error("Error fetching devotions:", error);
        if (!isMounted) return;
        setDevotions([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDevotions();
    const interval = window.setInterval(() => {
      fetchDevotions(true);
    }, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <LoadingState message="Loading devotions..." icon={BookOpen} />;
  }

  if (devotions.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
        <p className="text-foreground/70">No devotions available yet.</p>
        <p className="text-sm text-foreground/60 mt-2">Join us daily at 6:00 AM - 7:00 AM for live devotions!</p>
      </div>
    );
  }

  return (
    <StaggerContainer detectScrollDirection className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.2} direction="up">
      {devotions.map((devotion) => (
        <HoverAnimation key={devotion.id} scale={1.02} y={-8} className="h-full">
          <Link to={`/devotions/${devotion.id}`} className="block h-full">
            <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
              {devotion.image ? (
                <div className="relative h-48 overflow-hidden bg-muted/10">
                  <img
                    src={devotion.image}
                    alt={devotion.title}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-secondary opacity-40" />
                </div>
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2">{devotion.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-xs">
                  <Clock className="w-3 h-3" />
                  Daily 6:00 AM - 7:00 AM
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-sm text-foreground/70 line-clamp-3 mb-4">{devotion.excerpt}</p>
                {devotion.featuredVideoUrl && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full mb-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <a
                      href={devotion.featuredVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2"
                    >
                      <Play className="w-3 h-3" />
                      Watch Video
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                )}
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full mt-auto"
                >
                  <Link to={`/devotions/${devotion.id}`} className="inline-flex items-center justify-center gap-2">
                    Read More
                    <BookOpen className="w-3 h-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </Link>
        </HoverAnimation>
      ))}
    </StaggerContainer>
  );
}

// Latest Videos Cards Component
function LatestVideosCards() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchVideos = async (forceFresh = false) => {
      try {
        const res = await fetch("/api/youtube/latest?limit=3", {
          cache: forceFresh ? "no-store" : "default",
        });
        const data = await res.json();
        if (!isMounted) return;
        if (Array.isArray(data)) {
          setVideos(data.slice(0, 3));
        } else {
          setVideos([]);
        }
      } catch {
        if (!isMounted) return;
        setVideos([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchVideos();
    const interval = window.setInterval(() => {
      fetchVideos(true);
    }, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <LoadingState message="Loading videos..." icon={Play} />;
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
        <p className="text-foreground/70 mb-4">No videos available yet.</p>
        <a
          href="https://www.youtube.com/@sypeministry5276"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-accent font-semibold hover:text-accent-foreground transition-colors"
        >
          Visit Our YouTube Channel
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </a>
      </div>
    );
  }

  return (
    <StaggerContainer detectScrollDirection className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.2} direction="up">
      {videos.map((video) => (
        <HoverAnimation key={video.id} scale={1.02} y={-8} className="h-full">
          <a
            href={`https://www.youtube.com/watch?v=${video.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
          >
            <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="relative h-48 overflow-hidden flex-shrink-0">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&loop=1&playlist=${video.videoId}&controls=0&modestbranding=1&rel=0`}
                  title={video.title}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
              <CardHeader className="flex-shrink-0">
                <CardTitle className="line-clamp-2">{video.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-xs">
                  <Calendar className="w-3 h-3" />
                  {new Date(video.publishedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-foreground/70 line-clamp-3">{video.description}</p>
              </CardContent>
            </Card>
          </a>
        </HoverAnimation>
      ))}
    </StaggerContainer>
  );
}

function LatestEventsCards() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchEvents = async (forceFresh = false) => {
      try {
        const apiUrl = buildApiUrl("/api/events?limit=3");
        const res = await fetch(apiUrl, {
          cache: forceFresh ? "no-store" : "default",
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (!isMounted) return;
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching events:", error);
        if (!isMounted) return;
        setEvents([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchEvents();
    const interval = window.setInterval(() => {
      fetchEvents(true);
    }, 5 * 60 * 1000);
    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <LoadingState message="Loading events..." icon={Calendar} />;
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-14 h-14 text-muted-foreground mx-auto mb-3 opacity-40" />
        <p className="text-foreground/70">No events yet.</p>
      </div>
    );
  }

  return (
    <StaggerContainer detectScrollDirection className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.2} direction="up">
      {events.map((event) => (
        <HoverAnimation key={event.id} scale={1.02} y={-8} className="h-full">
          <Link to={`/events/${event.id}`} className="block h-full">
            <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                <CardDescription className="flex flex-col gap-1 text-xs">
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {new Date(event.date).toLocaleDateString()} • {event.time}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {event.location}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-sm text-foreground/70 line-clamp-3 mb-3">{event.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs text-foreground/60">{event.category}</span>
                  <Button asChild size="sm" variant="outline" className="pointer-events-none">
                    <span className="inline-flex items-center gap-2">
                      Read More
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </HoverAnimation>
      ))}
    </StaggerContainer>
  );
}

import SEO from "@/components/SEO";

export default function Home() {
  const [impactStats, setImpactStats] = useState({
    members: 0,
    projects: 0,
    mediaResources: 0,
  });

  useEffect(() => {
    let isMounted = true;
    const fetchImpactStats = async () => {
      try {
        const [analyticsRes, devotionsRes, booksRes, youtubeRes, projectsRes, eventsRes] = await Promise.all([
          fetch(buildApiUrl("/api/admin/analytics")),
          fetch(buildApiUrl("/api/devotions?limit=500")),
          fetch(buildApiUrl("/api/books")),
          fetch(buildApiUrl("/api/youtube/latest?limit=50")),
          fetch(buildApiUrl("/api/projects")),
          fetch(buildApiUrl("/api/events?limit=500")),
        ]);

        const analyticsData = analyticsRes.ok ? await analyticsRes.json() : null;
        const devotionsData = devotionsRes.ok ? await devotionsRes.json() : [];
        const booksData = booksRes.ok ? await booksRes.json() : [];
        const youtubeData = youtubeRes.ok ? await youtubeRes.json() : [];
        const projectsData = projectsRes.ok ? await projectsRes.json() : [];
        const eventsData = eventsRes.ok ? await eventsRes.json() : [];

        if (!isMounted) return;

        const membersCount = analyticsData?.totalMembers ?? 0;
        const projectsCount =
          (Array.isArray(projectsData) ? projectsData.length : 0) +
          (Array.isArray(eventsData) ? eventsData.length : 0);
        const devotionsCount = Array.isArray(devotionsData) ? devotionsData.length : 0;
        const booksCount = Array.isArray(booksData) ? booksData.length : 0;
        const youtubeCount = Array.isArray(youtubeData) ? youtubeData.length : 0;
        const mediaCount = devotionsCount + booksCount + youtubeCount;

        setImpactStats({
          members: membersCount,
          projects: projectsCount,
          mediaResources: mediaCount,
        });
      } catch (error) {
        if (!isMounted) return;
        setImpactStats((prev) => prev);
      }
    };

    fetchImpactStats();
    const interval = window.setInterval(() => {
      fetchImpactStats();
    }, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const prayerProgramsCount = useMemo(() => {
    const baseYear = 2020;
    const currentYear = new Date().getFullYear();
    const yearsCount = Math.max(0, currentYear - baseYear + 1);
    return yearsCount * 5;
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const easeOut = [0.16, 1, 0.3, 1] as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: easeOut },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
    hover: {
      y: -8,
      transition: { duration: 0.3 },
    },
  };

  return (
    <Layout>
      <SEO
        schema={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "SYPE Ministry",
          "url": "https://sypeministry.org",
          "logo": "https://www.sypeministry.org/sype-logo.webp",
          "sameAs": [
            "https://www.facebook.com/sypesda",
            "https://www.youtube.com/@sypeministry5276",
            "https://www.instagram.com/sype_ministry/"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+250780430990",
            "contactType": "customer service",
            "email": "sypeministry@gmail.com"
          }
        }}
      />
      {/* Hero Section */}
      <section id="home-hero" className="relative overflow-hidden bg-gradient-to-r from-primary via-secondary to-primary py-20 md:py-32 text-primary-foreground">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <motion.div
          className="container mx-auto px-4 relative z-10 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6"
            variants={itemVariants}
          >
            Equipping Young Professionals for Evangelism
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8 opacity-95"
            variants={itemVariants}
          >
            Seventh-day Adventist Young Professionals united to spread the
            Gospel through talents, professions, and service.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-base font-semibold rounded-lg transition-all"
              >
                <Link to="/membership">Join the Ministry</Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                className="bg-black text-white hover:bg-black/90 px-8 py-6 text-base font-semibold rounded-lg transition-all"
              >
                <Link to="/donations">Support Evangelism</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Snapshot Section */}
      <motion.section
        id="home-about"
        className="py-16 md:py-24 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              className="font-heading font-bold text-3xl md:text-4xl text-primary mb-6"
              variants={itemVariants}
            >
              Who We Are
            </motion.h2>
            <motion.p
              className="text-foreground/80 text-lg leading-relaxed mb-8"
              variants={itemVariants}
            >
              SYPE (Seventh-day Adventist Young Professionals in Evangelism) is
              a ministry uniting alumni and students from Adventist Associations
              in public universities in Kigali and beyond, dedicated to
              structured, consistent, and impactful evangelism.
            </motion.p>
            <motion.div variants={itemVariants} className="flex gap-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  asChild
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg transition-all"
                >
                  <Link to="/about">Learn More</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  asChild
                  variant="outline"
                  className="border-black text-black hover:bg-black hover:text-white px-6 py-3 rounded-lg transition-all"
                >
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission & Purpose Cards Section */}
      <motion.section
        id="home-mission"
        className="py-16 md:py-24 bg-muted/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="font-heading font-bold text-3xl md:text-4xl text-primary text-center mb-12"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Our Mission & Purpose
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Purpose Card */}
            <motion.div
              className="bg-white rounded-lg p-8 shadow-sm border border-border hover:shadow-lg transition-shadow"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <Target className="w-8 h-8 text-primary-foreground" />
                </motion.div>
              </div>
              <h3 className="font-heading font-bold text-xl text-primary text-center mb-4">
                Purpose
              </h3>
              <p className="text-foreground/80 text-center">
                Connecting and equipping young SDA professionals for active
                evangelism
              </p>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              className="bg-white rounded-lg p-8 shadow-sm border border-border hover:shadow-lg transition-shadow"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <Rocket className="w-8 h-8 text-primary" />
                </motion.div>
              </div>
              <h3 className="font-heading font-bold text-xl text-primary text-center mb-4">
                Mission
              </h3>
              <p className="text-foreground/80 text-center">
                Enabling professionals to serve through evangelical projects and
                outreach
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              className="bg-white rounded-lg p-8 shadow-sm border border-border hover:shadow-lg transition-shadow"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <Sprout className="w-8 h-8 text-primary" />
                </motion.div>
              </div>
              <h3 className="font-heading font-bold text-xl text-primary text-center mb-4">
                Vision
              </h3>
              <p className="text-foreground/80 text-center">
                Sustainable, organized, and innovative evangelism strategies
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Evangelical Impact Section */}
      <motion.section
        id="home-impact"
        className="py-16 md:py-24 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="font-heading font-bold text-3xl md:text-4xl text-primary text-center mb-12"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Evangelical Impact
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Stat Card */}
            <motion.div
              className="text-center"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  <Users className="w-6 h-6 text-primary" />
                </motion.div>
              </div>
              <p className="text-4xl font-heading font-bold text-primary mb-2">
                {impactStats.members}
              </p>
              <p className="text-foreground/70 font-medium">Active Members</p>
            </motion.div>

            {/* Stat Card */}
            <motion.div
              className="text-center"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  <Rocket className="w-6 h-6 text-secondary" />
                </motion.div>
              </div>
              <p className="text-4xl font-heading font-bold text-secondary mb-2">
                {impactStats.projects}
              </p>
              <p className="text-foreground/70 font-medium">
                Evangelical Projects
              </p>
            </motion.div>

            {/* Stat Card */}
            <motion.div
              className="text-center"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  className="w-12 h-12 bg-accent/30 rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  <BookOpen className="w-6 h-6 text-accent-foreground" />
                </motion.div>
              </div>
              <p className="text-4xl font-heading font-bold text-primary mb-2">
                {impactStats.mediaResources}
              </p>
              <p className="text-foreground/70 font-medium">Media Resources</p>
            </motion.div>

            {/* Stat Card */}
            <motion.div
              className="text-center"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  <Target className="w-6 h-6 text-primary" />
                </motion.div>
              </div>
              <p className="text-4xl font-heading font-bold text-primary mb-2">
                {prayerProgramsCount}
              </p>
              <p className="text-foreground/70 font-medium">
                Prayer & Outreach Programs
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Our Recent Events Section */}
      <section id="home-events" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="fade" delay={0.4}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary">
                Latest Events
              </h2>
              <Button
                asChild
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 rounded-md"
              >
                <Link to="/projects" className="inline-flex items-center gap-2">
                  View All
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Link>
              </Button>
            </div>
          </ScrollAnimation>
          <LazySection component="LatestEventsCards" title="Our Recent Events" />
        </div>
      </section>

      {/* Featured Content Section - Latest News */}
      <section id="home-news" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="fade" delay={0.4}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary">
                Latest News
              </h2>
              <Button
                asChild
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 rounded-md"
              >
                <Link to="/news" className="inline-flex items-center gap-2">
                  View All
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Link>
              </Button>
            </div>
          </ScrollAnimation>

          <LazySection component="LatestNewsCards" title="Latest News" />
        </div>
      </section>

      {/* Featured Content Section - Devotions */}
      <section id="home-devotions" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="fade" delay={0.4}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary">
                Devotions
              </h2>
              <Button
                asChild
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 rounded-md"
              >
                <Link to="/devotions" className="inline-flex items-center gap-2">
                  View All
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Link>
              </Button>
            </div>
          </ScrollAnimation>

          <LazySection component="LatestDevotionsCards" title="Devotions" />
        </div>
      </section>

      {/* Featured Content Section - Videos & Multimedia */}
      <section id="home-videos" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="fade" delay={0.4}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary">
                Videos & Multimedia
              </h2>
              <Button
                asChild
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 rounded-md"
              >
                <Link to="/videos" className="inline-flex items-center gap-2">
                  View All
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Link>
              </Button>
            </div>
          </ScrollAnimation>

          <LazySection component="LatestVideosCards" title="Videos & Multimedia" />
        </div>
      </section>

      {/* Devotions Section */}
      <section id="home-daily-devotions" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="up" delay={0.4}>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-6">
              Daily Devotion Program
            </h2>
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={0.4}>
            <p className="text-foreground/70 text-lg max-w-3xl mb-8 leading-relaxed">
              Join us every day from 6:00 AM to 7:00 AM for an hour of prayer
              and spiritual reflection. Our daily devotion program is guided by
              Jesus' methods and Ellen G. White's teachings on Evangelism
              (Ivugabutumwa).
            </p>
          </ScrollAnimation>

          <StaggerContainer detectScrollDirection
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
            staggerDelay={0.2}
            direction="up"
          >
            <HoverAnimation scale={1.02} y={-5}>
              <motion.div
                className="bg-accent/10 rounded-lg p-6 border border-accent/30 hover:border-accent/50 transition-all"
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.15)" }}
              >
                <motion.div
                  className="flex items-center gap-2 mb-3"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Heart className="w-5 h-5 text-primary" />
                  <h3 className="font-heading font-bold text-lg text-primary">
                    Prayer & Reflection
                  </h3>
                </motion.div>
                <p className="text-foreground/70 text-sm">
                  Focused discussion about Jesus' evangelism methods and biblical
                  principles for sharing faith
                </p>
              </motion.div>
            </HoverAnimation>

            <HoverAnimation scale={1.02} y={-5}>
              <motion.div
                className="bg-accent/10 rounded-lg p-6 border border-accent/30 hover:border-accent/50 transition-all"
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.15)" }}
              >
                <motion.div
                  className="flex items-center gap-2 mb-3"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h3 className="font-heading font-bold text-lg text-primary">
                    Ellen G. White Study
                  </h3>
                </motion.div>
                <p className="text-foreground/70 text-sm">
                  Explore insights from "Evangelism (Ivugabutumwa)" and apply them
                  to modern ministry
                </p>
              </motion.div>
            </HoverAnimation>

            <HoverAnimation scale={1.02} y={-5}>
              <motion.div
                className="bg-accent/10 rounded-lg p-6 border border-accent/30 hover:border-accent/50 transition-all"
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.15)" }}
              >
                <motion.div
                  className="flex items-center gap-2 mb-3"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <h3 className="font-heading font-bold text-lg text-primary">
                    Community Sharing
                  </h3>
                </motion.div>
                <p className="text-foreground/70 text-sm">
                  Connect with other young professionals and share prayer requests
                  together
                </p>
              </motion.div>
            </HoverAnimation>
          </StaggerContainer>

          <ScrollAnimation direction="fade" delay={1.0}>
            <p className="text-foreground/70 text-center">
              <strong>When:</strong> Every day, 6:00 AM – 7:00 AM <br />
              <strong>Where:</strong> WhatsApp Community Group
            </p>
          </ScrollAnimation>
        </div>
      </section>


      {/* CTA Section */}
      <section id="home-cta" className="py-16 md:py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute top-10 right-10 w-72 h-72 bg-accent rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-10 left-10 w-96 h-96 bg-secondary rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <ScrollAnimation direction="scale" delay={0.2}>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
              Ready to Make a Difference?
            </h2>
          </ScrollAnimation>
          <ScrollAnimation direction="fade" delay={0.4}>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Join SYPE Ministry and be part of a movement spreading the Gospel
              through your talents, profession, and service.
            </p>
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={0.6}>
            <HoverAnimation scale={1.05}>
              <Button
                asChild
                className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Link to="/membership">Join SYPE Today</Link>
              </Button>
            </HoverAnimation>
          </ScrollAnimation>
        </div>
      </section>

      {/* WhatsApp Training Group Section */}
      <section id="home-whatsapp" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <ScrollAnimation direction="fade" delay={0.2}>
              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6 border-2 border-green-500/30">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg text-primary mb-1">
                        Join Our Training Program
                      </h3>
                      <p className="text-sm text-foreground/70">
                        Connect with members on WhatsApp for training and discussions
                      </p>
                    </div>
                  </div>
                  <Button
                    asChild
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-6 text-base font-semibold rounded-lg whitespace-nowrap"
                  >
                    <a
                      href="https://chat.whatsapp.com/DIKintfrZjbARzYMQ1SQbN"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join WhatsApp Group
                    </a>
                  </Button>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </Layout>
  );
}
