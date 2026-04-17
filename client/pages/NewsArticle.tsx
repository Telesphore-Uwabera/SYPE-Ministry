import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { buildApiUrl } from "@/lib/apiConfig";
import { NewsArticle } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ArrowLeft, Newspaper } from "lucide-react";
import SEO from "@/components/SEO";
import { LoadingState } from "@/components/ui/LoadingState";

export default function NewsArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        if (!id) return;
        const res = await fetch(buildApiUrl(`/api/news/${id}`), { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setArticle(data);
      } catch (e) {
        console.error("Failed to fetch news article:", e);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  return (
    <Layout>
      <section className="py-10 md:py-14 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button asChild variant="outline" className="mb-6">
            <Link to="/news" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to News
            </Link>
          </Button>

          {loading ? (
            <LoadingState message="Loading article..." icon={Newspaper} />
          ) : !article ? (
            <div className="text-foreground/70">Article not found.</div>
          ) : (
            <>
              <SEO
                title={article.title}
                description={article.excerpt || article.body?.substring(0, 160)}
                image={article.image}
                type="article"
                schema={{
                  "@context": "https://schema.org",
                  "@type": "NewsArticle",
                  "headline": article.title,
                  "image": article.image ? [article.image] : [],
                  "datePublished": article.publishDate,
                  "author": [{
                    "@type": "Person",
                    "name": article.author || "SYPE Ministry"
                  }]
                }}
              />
              <Card>
                {article.image && (
                  <div className="border-b">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full max-h-[420px] object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-3xl text-primary">{article.title}</CardTitle>
                  <div className="text-sm text-foreground/70 flex flex-wrap items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(article.publishDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    {article.author && (
                      <>
                        <span className="text-foreground/40">•</span>
                        <span>{article.author}</span>
                      </>
                    )}
                    {article.category && (
                      <>
                        <span className="text-foreground/40">•</span>
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          {article.category}
                        </span>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {article.excerpt && (
                    <p className="text-foreground/80 font-medium">{article.excerpt}</p>
                  )}
                  {article.body && (
                    <div className="prose prose-slate max-w-none">
                      <p className="whitespace-pre-wrap text-foreground/80 leading-relaxed">
                        {article.body}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}

