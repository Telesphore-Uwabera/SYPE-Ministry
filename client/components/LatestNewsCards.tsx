import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Newspaper, Calendar, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import ScrollAnimation, { StaggerContainer, HoverAnimation } from "@/components/ScrollAnimation";
import { useEffect, useState } from "react";
import { NewsArticle } from "@/types/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildApiUrl } from "@/lib/apiConfig";
import { LoadingState } from "@/components/ui/LoadingState";

// Latest News Cards Component
export default function LatestNewsCards() {
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

  if (loading && !checkIsBot()) {
    return <LoadingState message="Loading latest news..." />;
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
                    loading="lazy"
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
