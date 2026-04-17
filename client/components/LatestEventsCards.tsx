import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import ScrollAnimation, { StaggerContainer, HoverAnimation } from "@/components/ScrollAnimation";
import { useEffect, useState } from "react";
import { Event } from "@/types/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildApiUrl } from "@/lib/apiConfig";
import { LoadingState } from "@/components/ui/LoadingState";

// Latest Events Cards Component
export default function LatestEventsCards() {
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
    return <LoadingState message="Loading latest events..." />;
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
