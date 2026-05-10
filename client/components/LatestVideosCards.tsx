import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Calendar, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import ScrollAnimation, { StaggerContainer, HoverAnimation } from "@/components/ScrollAnimation";
import { useEffect, useState } from "react";
import { Event } from "@/types/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildApiUrl } from "@/lib/apiConfig";
import { LoadingState } from "@/components/ui/LoadingState";
import { checkIsBot } from "@/lib/utils/botDetection";

// YouTube Video interface
interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  description: string;
  videoId: string;
}

// Latest Videos Cards Component
export default function LatestVideosCards() {
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

  if (loading && !checkIsBot()) {
    return <LoadingState message="Loading latest videos..." />;
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
                  loading="lazy"
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
