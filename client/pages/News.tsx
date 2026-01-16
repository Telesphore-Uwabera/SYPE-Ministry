import { Link, useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Newspaper, ArrowLeft, ArrowRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import ScrollAnimation, { StaggerContainer, HoverAnimation } from "@/components/ScrollAnimation";
import { NewsArticle } from "@/types/admin";
import { Input } from "@/components/ui/input";
import { buildApiUrl } from "@/lib/apiConfig";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function News() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiUrl = buildApiUrl("/api/news");
        console.log("Fetching news from:", apiUrl);
        
        const res = await fetch(apiUrl);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error(`HTTP error! status: ${res.status}`, errorText);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("News data received:", data);
        
        if (Array.isArray(data)) {
          // Sort by publishDate (newest first)
          const sortedNews = data.sort(
            (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
          );
          console.log("Sorted news:", sortedNews);
          setNews(sortedNews);
        } else {
          console.warn("News data is not an array:", data);
          setNews([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
        setNews([]); // Set empty array on error
      }
    };
    
    fetchNews();
  }, []);

  // Support deep linking from Home cards: /news#<articleId>
  useEffect(() => {
    if (!news.length) return;
    const hash = (location.hash || "").replace("#", "").trim();
    if (!hash) return;
    const match = news.find((a) => a.id === hash);
    if (match) {
      setSelectedArticle(match);
    }
  }, [location.hash, news]);

  const filteredNews = news.filter((article) => {
    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.excerpt?.toLowerCase().includes(query) ||
      article.body?.toLowerCase().includes(query) ||
      article.author?.toLowerCase().includes(query) ||
      article.category?.toLowerCase().includes(query) ||
      article.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-secondary to-primary py-16 md:py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation direction="fade" delay={0.2}>
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Latest News
            </h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Stay informed with ministry updates, announcements, event reports, and inspiring stories from our field missions.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* News Articles Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <ScrollAnimation direction="fade" delay={0.2}>
            <div className="mb-8 max-w-2xl mx-auto">
              <div className="relative">
                <Newspaper className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search news articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base"
                />
              </div>
              {searchQuery && (
                <p className="text-sm text-foreground/70 mt-2 text-center">
                  Found {filteredNews.length} article{filteredNews.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </ScrollAnimation>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-16">
              <Newspaper className="w-24 h-24 text-muted-foreground mx-auto mb-6 opacity-40" />
              <h3 className="text-2xl font-bold text-primary mb-3">
                {searchQuery ? "No articles found" : "No news articles yet"}
              </h3>
              <p className="text-foreground/70 mb-6">
                {searchQuery
                  ? "Try adjusting your search terms."
                  : "News articles will appear here once they are published."}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  className="inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <StaggerContainer
              detectScrollDirection
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              staggerDelay={0.15}
              direction="up"
            >
              {filteredNews.map((article) => (
                <HoverAnimation key={article.id} scale={1.02} y={-5}>
                  <div className="block h-full">
                    <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300">
                      {article.image ? (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          />
                          {article.featured && (
                            <div className="absolute top-2 right-2">
                              <span className="bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded">
                                Featured
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <Newspaper className="w-16 h-16 text-primary opacity-40" />
                        </div>
                      )}
                      <CardHeader>
                        <CardDescription className="flex items-center gap-2 text-xs mb-2">
                          <Calendar className="w-3 h-3" />
                          {new Date(article.publishDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                          {article.author && (
                            <>
                              <span className="mx-1">•</span>
                              <span>{article.author}</span>
                            </>
                          )}
                        </CardDescription>
                        <CardTitle className="line-clamp-2 text-lg">{article.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-foreground/70 line-clamp-3 mb-4">
                          {article.excerpt || article.body?.substring(0, 150) + "..."}
                        </p>
                        {article.category && (
                          <div className="mb-3">
                            <span className="text-xs bg-muted px-2 py-1 rounded">
                              {article.category}
                            </span>
                          </div>
                        )}
                        {article.tags && article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {article.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                          onClick={() => {
                            setSelectedArticle(article);
                            navigate({ pathname: "/news", hash: `#${article.id}` }, { replace: false });
                          }}
                        >
                          Read More
                          <ArrowRight className="w-3 h-3 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </HoverAnimation>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      <Dialog
        open={!!selectedArticle}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedArticle(null);
            // Clear hash when closing so refresh doesn't re-open
            navigate({ pathname: "/news" }, { replace: true });
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {selectedArticle && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <DialogTitle className="text-2xl font-bold text-primary">
                    {selectedArticle.title}
                  </DialogTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedArticle(null);
                      navigate({ pathname: "/news" }, { replace: true });
                    }}
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-sm text-foreground/70 flex flex-wrap items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedArticle.publishDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  {selectedArticle.author && (
                    <>
                      <span className="text-foreground/40">•</span>
                      <span>{selectedArticle.author}</span>
                    </>
                  )}
                  {selectedArticle.category && (
                    <>
                      <span className="text-foreground/40">•</span>
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        {selectedArticle.category}
                      </span>
                    </>
                  )}
                </div>
              </DialogHeader>

              {selectedArticle.image && (
                <div className="mt-4 rounded-lg overflow-hidden border">
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full max-h-[360px] object-cover"
                  />
                </div>
              )}

              <div className="mt-4 space-y-4">
                {selectedArticle.excerpt && (
                  <p className="text-foreground/80 font-medium">
                    {selectedArticle.excerpt}
                  </p>
                )}
                {selectedArticle.body && (
                  <div className="prose prose-slate max-w-none">
                    <p className="whitespace-pre-wrap text-foreground/80 leading-relaxed">
                      {selectedArticle.body}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
