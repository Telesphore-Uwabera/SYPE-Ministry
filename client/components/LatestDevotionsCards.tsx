import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Play, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import ScrollAnimation, { StaggerContainer, HoverAnimation } from "@/components/ScrollAnimation";
import { useEffect, useState } from "react";
import { Devotion } from "@/types/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildApiUrl } from "@/lib/apiConfig";

// Latest Devotions Cards Component
export default function LatestDevotionsCards() {
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
    return (
      <StaggerContainer detectScrollDirection className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.2} direction="up">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
        ))}
      </StaggerContainer>
    );
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
                    loading="lazy"
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
