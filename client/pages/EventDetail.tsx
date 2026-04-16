import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { buildApiUrl } from "@/lib/apiConfig";
import { Event } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ArrowLeft, Clock, MapPin, Tag } from "lucide-react";
import SEO from "@/components/SEO";
import { LoadingState } from "@/components/ui/LoadingState";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        if (!id) return;
        const res = await fetch(buildApiUrl(`/api/events/${id}`), { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setEvent(data);
      } catch (e) {
        console.error("Failed to fetch event:", e);
        setEvent(null);
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
            <Link to="/projects" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </Button>

          {loading ? (
            <LoadingState message="Loading event details..." />
          ) : !event ? (
            <div className="text-foreground/70">Event not found.</div>
          ) : (
            <>
              <SEO
                title={event.title}
                description={event.description?.substring(0, 160)}
                type="article"
                schema={{
                  "@context": "https://schema.org",
                  "@type": "Event",
                  "name": event.title,
                  "startDate": `${new Date(event.date).toISOString().split('T')[0]}T${event.time || '00:00'}:00`,
                  "location": {
                    "@type": "Place",
                    "name": event.location,
                    "address": {
                      "@type": "PostalAddress",
                      "addressLocality": "Kigali",
                      "addressCountry": "RW"
                    }
                  }
                }}
              />
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl text-primary">{event.title}</CardTitle>
                  <div className="text-sm text-foreground/70 flex flex-wrap gap-3 mt-2">
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      {event.category}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-slate max-w-none">
                    <p className="whitespace-pre-wrap text-foreground/80 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}

