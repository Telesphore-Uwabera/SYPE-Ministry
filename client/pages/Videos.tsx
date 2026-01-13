import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Calendar, ExternalLink, Youtube, BookOpen, Mic, Image as ImageIcon, Video } from "lucide-react";
import { motion } from "framer-motion";
import ScrollAnimation, { StaggerContainer, HoverAnimation } from "@/components/ScrollAnimation";
import { MediaFile } from "@/types/admin";

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  description: string;
  videoId: string;
}

export default function Videos() {
  const [activeTab, setActiveTab] = useState("sermons");
  
  // Latest Videos (YouTube - no category filter)
  const [latestVideos, setLatestVideos] = useState<YouTubeVideo[]>([]);
  const [latestVideosLoading, setLatestVideosLoading] = useState(true);
  
  // Sermons & Teachings (YouTube)
  const [sermons, setSermons] = useState<YouTubeVideo[]>([]);
  const [sermonsLoading, setSermonsLoading] = useState(true);
  
  // Evangelism Videos (YouTube)
  const [evangelism, setEvangelism] = useState<YouTubeVideo[]>([]);
  const [evangelismLoading, setEvangelismLoading] = useState(true);
  
  // Testimonies (Admin-uploaded media)
  const [testimonies, setTestimonies] = useState<MediaFile[]>([]);
  const [testimoniesLoading, setTestimoniesLoading] = useState(true);
  
  // Graphics & Posters (Admin-uploaded media)
  const [graphics, setGraphics] = useState<MediaFile[]>([]);
  const [graphicsLoading, setGraphicsLoading] = useState(true);

  // Fetch Latest Videos from YouTube (no category filter)
  useEffect(() => {
    fetch("/api/youtube/latest?limit=3")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLatestVideos(data);
        }
        setLatestVideosLoading(false);
      })
      .catch(() => {
        setLatestVideosLoading(false);
      });
  }, []);

  // Fetch Sermons & Teachings from YouTube
  useEffect(() => {
    fetch("/api/youtube/videos?category=sermons&limit=6")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSermons(data);
        }
        setSermonsLoading(false);
      })
      .catch(() => {
        setSermonsLoading(false);
      });
  }, []);

  // Fetch Evangelism Videos from YouTube
  useEffect(() => {
    fetch("/api/youtube/videos?category=evangelism&limit=6")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEvangelism(data);
        }
        setEvangelismLoading(false);
      })
      .catch(() => {
        setEvangelismLoading(false);
      });
  }, []);

  // Fetch Testimonies (admin-uploaded media with category "testimony")
  useEffect(() => {
    fetch("/api/admin/media?category=testimony&type=video")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTestimonies(data.slice(0, 6));
        }
        setTestimoniesLoading(false);
      })
      .catch(() => {
        setTestimoniesLoading(false);
      });
  }, []);

  // Fetch Graphics & Posters (admin-uploaded media with category "graphics" or "posters")
  useEffect(() => {
    fetch("/api/admin/media?category=graphics,posters&type=image")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setGraphics(data.slice(0, 6));
        }
        setGraphicsLoading(false);
      })
      .catch(() => {
        setGraphicsLoading(false);
      });
  }, []);

  // Helper component to render YouTube videos
  const renderYouTubeVideos = (videos: YouTubeVideo[], loading: boolean, error?: string) => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      );
    }

    if (error || videos.length === 0) {
      return (
        <div className="text-center py-12">
          <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
          <p className="text-foreground/70 mb-4">
            {error || "No videos available yet."}
          </p>
          <Button
            asChild
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          >
            <a
              href="https://www.youtube.com/@sypeministry5276"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <Youtube className="w-4 h-4" />
              Visit Our YouTube Channel
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      );
    }

    return (
      <StaggerContainer
        detectScrollDirection
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        staggerDelay={0.2}
        direction="up"
      >
        {videos.map((video) => (
          <HoverAnimation key={video.id} scale={1.02} y={-8} className="h-full">
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full"
            >
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110">
                      <Play className="w-8 h-8 text-primary fill-primary" />
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Youtube className="w-3 h-3" />
                    YouTube
                  </div>
                </div>
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="line-clamp-2 text-base">{video.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3 h-3" />
                    {new Date(video.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <p className="text-sm text-foreground/70 line-clamp-3 mb-4 flex-grow">
                    {video.description}
                  </p>
                  <div className="flex items-center gap-2 text-accent text-sm font-semibold mt-auto">
                    Watch on YouTube
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </CardContent>
              </Card>
            </a>
          </HoverAnimation>
        ))}
      </StaggerContainer>
    );
  };

  // Helper component to render media files (Testimonies/Graphics)
  const renderMediaFiles = (files: MediaFile[], loading: boolean, isVideo: boolean = false) => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      );
    }

    if (files.length === 0) {
      return (
        <div className="text-center py-12">
          {isVideo ? (
            <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
          ) : (
            <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
          )}
          <p className="text-foreground/70 mb-4">
            No {isVideo ? "testimonies" : "graphics"} available yet.
          </p>
          <p className="text-sm text-foreground/60">
            {isVideo
              ? "Testimonies will be uploaded by admin once members submit them."
              : "Graphics and posters will be uploaded by admin."}
          </p>
        </div>
      );
    }

    return (
      <StaggerContainer
        detectScrollDirection
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        staggerDelay={0.2}
        direction="up"
      >
        {files.map((file) => (
          <HoverAnimation key={file.id} scale={1.02} y={-8} className="h-full">
            {isVideo ? (
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex-shrink-0">
                  {file.thumbnail ? (
                    <img
                      src={file.thumbnail}
                      alt={file.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-16 h-16 text-primary opacity-40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110">
                      <Play className="w-8 h-8 text-primary fill-primary" />
                    </div>
                  </div>
                </div>
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="line-clamp-2 text-base">{file.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3 h-3" />
                    {new Date(file.uploadDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <p className="text-sm text-foreground/70 line-clamp-3 mb-4 flex-grow">
                    {file.description || file.name}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full mt-auto"
                  >
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2"
                    >
                      Watch Video
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="line-clamp-2 text-base">{file.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3 h-3" />
                    {new Date(file.uploadDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <p className="text-sm text-foreground/70 line-clamp-3 mb-4 flex-grow">
                    {file.description || file.name}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full mt-auto"
                  >
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2"
                    >
                      View Full Size
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </HoverAnimation>
        ))}
      </StaggerContainer>
    );
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-secondary to-primary py-16 md:py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation direction="fade" delay={0.2}>
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Videos & Multimedia
            </h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-6">
              Explore our collection of sermons, evangelism videos, testimonies, and multimedia resources that inspire and equip believers.
            </p>
            <Button
              asChild
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <a
                href="https://www.youtube.com/@sypeministry5276"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Youtube className="w-5 h-5" />
                Subscribe on YouTube
              </a>
            </Button>
          </ScrollAnimation>
        </div>
      </section>

      {/* Latest Videos Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="fade" delay={0.3}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2">
                  Latest Videos
                </h2>
                <p className="text-foreground/70">
                  Watch our most recent uploads from our YouTube channel
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                <a
                  href="https://www.youtube.com/@sypeministry5276"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  View All →
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
            {renderYouTubeVideos(latestVideos, latestVideosLoading)}
          </ScrollAnimation>
        </div>
      </section>

      {/* Content Section with Tabs */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="fade" delay={0.4}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
                <TabsTrigger value="sermons" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Sermons & Teachings</span>
                  <span className="sm:hidden">Sermons</span>
                </TabsTrigger>
                <TabsTrigger value="evangelism" className="flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  <span className="hidden sm:inline">Evangelism Videos</span>
                  <span className="sm:hidden">Evangelism</span>
                </TabsTrigger>
                <TabsTrigger value="testimonies" className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Testimonies
                </TabsTrigger>
                <TabsTrigger value="graphics" className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Graphics & Posters</span>
                  <span className="sm:hidden">Graphics</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sermons" className="mt-6">
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
                  Sermons & Teachings
                </h2>
                <p className="text-foreground/70 mb-8">
                  Inspiring sermons and biblical teachings to deepen your faith and understanding of God's Word.
                </p>
                {renderYouTubeVideos(sermons, sermonsLoading)}
                {!sermonsLoading && sermons.length > 0 && (
                  <div className="text-center mt-12">
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                    >
                      <a
                        href="https://www.youtube.com/@sypeministry5276"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        <Youtube className="w-5 h-5" />
                        View All Sermons on YouTube
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="evangelism" className="mt-6">
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
                  Evangelism Videos
                </h2>
                <p className="text-foreground/70 mb-8">
                  Practical videos demonstrating Jesus' methods and effective ways to share the Gospel with others.
                </p>
                {renderYouTubeVideos(evangelism, evangelismLoading)}
                {!evangelismLoading && evangelism.length > 0 && (
                  <div className="text-center mt-12">
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                    >
                      <a
                        href="https://www.youtube.com/@sypeministry5276"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        <Youtube className="w-5 h-5" />
                        View All Evangelism Videos on YouTube
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="testimonies" className="mt-6">
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
                  Testimonies
                </h2>
                <p className="text-foreground/70 mb-8">
                  Real stories of transformation and faith from members of the SYPE community.
                </p>
                {renderMediaFiles(testimonies, testimoniesLoading, true)}
              </TabsContent>

              <TabsContent value="graphics" className="mt-6">
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-6">
                  Graphics & Posters
                </h2>
                <p className="text-foreground/70 mb-8">
                  Visual content for social media sharing and evangelistic outreach.
                </p>
                {renderMediaFiles(graphics, graphicsLoading, false)}
              </TabsContent>
            </Tabs>
          </ScrollAnimation>
        </div>
      </section>
    </Layout>
  );
}
