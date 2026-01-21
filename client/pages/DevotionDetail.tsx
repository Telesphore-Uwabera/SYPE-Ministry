import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { buildApiUrl } from "@/lib/apiConfig";
import { Devotion } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ArrowLeft } from "lucide-react";
import SEO from "@/components/SEO";

export default function DevotionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [devotion, setDevotion] = useState<Devotion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        if (!id) return;
        const res = await fetch(buildApiUrl(`/api/devotions/${id}`), { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setDevotion(data);
      } catch (e) {
        console.error("Failed to fetch devotion:", e);
        setDevotion(null);
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
            <Link to="/devotions" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Devotions
            </Link>
          </Button>

          {loading ? (
            <div className="text-foreground/70">Loading...</div>
          ) : !devotion ? (
            <div className="text-foreground/70">Devotion not found.</div>
          ) : (
            <>
              <SEO
                title={devotion.title}
                description={devotion.excerpt || devotion.content?.substring(0, 160)}
                image={devotion.image}
                type="article"
                schema={{
                  "@context": "https://schema.org",
                  "@type": "NewsArticle",
                  "headline": devotion.title,
                  "image": devotion.image ? [devotion.image] : [],
                  "datePublished": devotion.date,
                  "author": [{
                    "@type": "Person",
                    "name": "SYPE Ministry"
                  }]
                }}
              />
              <Card>
                {devotion.image && (
                  <div className="border-b">
                    <img
                      src={devotion.image}
                      alt={devotion.title}
                      className="w-full max-h-[420px] object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-3xl text-primary">{devotion.title}</CardTitle>
                  <div className="text-sm text-foreground/70 flex items-center gap-2 mt-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(devotion.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {devotion.excerpt && (
                    <p className="text-foreground/80 font-medium">{devotion.excerpt}</p>
                  )}
                  {devotion.content && (
                    <div className="prose prose-slate max-w-none">
                      <p className="whitespace-pre-wrap text-foreground/80 leading-relaxed">
                        {devotion.content}
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

