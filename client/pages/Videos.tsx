import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Calendar, ExternalLink, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import ScrollAnimation, { StaggerContainer, HoverAnimation } from "@/components/ScrollAnimation";

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  description: string;
  videoId: string;
}

export default function Videos() {
  // Latest Videos (YouTube - no category filter)
  const [latestVideos, setLatestVideos] = useState<YouTubeVideo[]>([]);
  const [latestVideosLoading, setLatestVideosLoading] = useState(true);

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
            <div className="mb-8">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary mb-2">
                Latest Videos
              </h2>
              <p className="text-foreground/70">
                Watch our most recent uploads from our YouTube channel
              </p>
            </div>
            {renderYouTubeVideos(latestVideos, latestVideosLoading)}
            
            {/* Follow YouTube Section */}
            {!latestVideosLoading && latestVideos.length > 0 && (
              <div className="text-center mt-12">
                <p className="text-foreground/70 mb-6 text-lg">
                  Follow our YouTube channel and social media for the latest videos and multimedia content
                </p>
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
                    Visit Our YouTube Channel
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </Button>
              </div>
            )}
          </ScrollAnimation>
        </div>
      </section>

    </Layout>
  );
}
