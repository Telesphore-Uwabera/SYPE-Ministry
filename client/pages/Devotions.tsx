import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, BookOpen, Heart, Calendar, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import ScrollAnimation, { StaggerContainer, HoverAnimation } from "@/components/ScrollAnimation";
import { Devotion } from "@/types/admin";
import { buildApiUrl } from "@/lib/apiConfig";

export default function Devotions() {
  const [devotions, setDevotions] = useState<Devotion[]>([]);
  const [devotionsLoading, setDevotionsLoading] = useState(true);

  useEffect(() => {
    const fetchDevotions = async () => {
      try {
        const apiUrl = buildApiUrl("/api/devotions");
        console.log("Fetching devotions from:", apiUrl);

        const res = await fetch(apiUrl);

        if (!res.ok) {
          const errorText = await res.text();
          console.error(`HTTP error! status: ${res.status}`, errorText);
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Devotions data received:", data);

        if (Array.isArray(data)) {
          // Sort by date (newest first)
          const sortedDevotions = data.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          console.log("Sorted devotions:", sortedDevotions);
          setDevotions(sortedDevotions);
        } else {
          console.warn("Devotions data is not an array:", data);
          setDevotions([]);
        }
        setDevotionsLoading(false);
      } catch (error) {
        console.error("Error fetching devotions:", error);
        setDevotionsLoading(false);
        setDevotions([]); // Set empty array on error
      }
    };

    fetchDevotions();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-secondary to-primary py-16 md:py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation direction="fade" delay={0.2}>
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Daily Devotion Program
            </h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Join us every day for prayer and spiritual reflection guided by Jesus'
              methods and Ellen G. White's teachings on Evangelism
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto items-stretch">
            {/* Schedule Card */}
            <ScrollAnimation direction="left" delay={0.2}>
              <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg p-8 border border-accent/30 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-6 h-6 text-primary" />
                  <h2 className="font-heading font-bold text-2xl text-primary">
                    Program Schedule
                  </h2>
                </div>

                <div className="space-y-12 flex-grow">
                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-primary mb-1">Time</p>
                      <p className="text-foreground/70">
                        Every day: 6:00 AM – 7:00 AM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Users className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-primary mb-1">Platform</p>
                      <p className="text-foreground/70">
                        WhatsApp Community Group
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <BookOpen className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-primary mb-1">Duration</p>
                      <p className="text-foreground/70">
                        1 hour of focused prayer
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Heart className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-primary mb-1">Leadership</p>
                      <p className="text-foreground/70">
                        Rotating member leaders (daily)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Program Format Card */}
            <ScrollAnimation direction="right" delay={0.2}>
              <div className="bg-white rounded-lg p-8 border border-border shadow-sm h-full flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <Heart className="w-6 h-6 text-primary" />
                  <h2 className="font-heading font-bold text-2xl text-primary">
                    Program Format
                  </h2>
                </div>

                <div className="space-y-4 flex-grow">
                  <div>
                    <h3 className="font-heading font-semibold text-primary mb-2">
                      1. Opening Prayer
                    </h3>
                    <p className="text-foreground/70 text-sm">
                      Start with an opening prayer, asking for God's guidance
                    </p>
                  </div>

                  <div>
                    <h3 className="font-heading font-semibold text-primary mb-2">
                      2. Scripture Meditation
                    </h3>
                    <p className="text-foreground/70 text-sm">
                      Reflect on Jesus' evangelism methods and biblical principles
                    </p>
                  </div>

                  <div>
                    <h3 className="font-heading font-semibold text-primary mb-2">
                      3. Ellen G. White Insight
                    </h3>
                    <p className="text-foreground/70 text-sm">
                      Discuss quotes and teachings from "Evangelism
                      (Ivugabutumwa)"
                    </p>
                  </div>

                  <div>
                    <h3 className="font-heading font-semibold text-primary mb-2">
                      4. Group Discussion
                    </h3>
                    <p className="text-foreground/70 text-sm">
                      Share insights and how the principles apply to evangelism
                    </p>
                  </div>

                  <div>
                    <h3 className="font-heading font-semibold text-primary mb-2">
                      5. Prayer Requests
                    </h3>
                    <p className="text-foreground/70 text-sm">
                      Share and pray for personal and ministry prayer requests
                    </p>
                  </div>

                  <div>
                    <h3 className="font-heading font-semibold text-primary mb-2">
                      6. Closing Prayer
                    </h3>
                    <p className="text-foreground/70 text-sm">
                      End with unified prayer for the week ahead
                    </p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Devotions Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="up" delay={0.2}>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary text-center mb-12">
              Daily Devotions
            </h2>
            <p className="text-foreground/70 text-center max-w-2xl mx-auto mb-8">
              Browse through our daily devotions. Each devotion contains spiritual messages and inspiration for your daily walk with God.
            </p>
          </ScrollAnimation>

          {devotionsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : devotions.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
              <p className="text-foreground/70 mb-4">No devotions available yet.</p>
              <p className="text-sm text-foreground/60">
                Devotions will be published by admin and displayed here.
              </p>
            </div>
          ) : (
            <StaggerContainer
              detectScrollDirection
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              staggerDelay={0.15}
              direction="up"
            >
              {devotions.map((devotion) => (
                <HoverAnimation key={devotion.id} scale={1.02} y={-5}>
                  <Link to={`/devotions/${devotion.id}`} className="block h-full">
                    <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300">
                      {devotion.image ? (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={devotion.image}
                            alt={devotion.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-primary opacity-40" />
                        </div>
                      )}
                      <CardHeader>
                        <CardDescription className="flex items-center gap-2 text-xs mb-2">
                          <Calendar className="w-3 h-3" />
                          {new Date(devotion.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </CardDescription>
                        <CardTitle className="line-clamp-2 text-lg">{devotion.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-foreground/70 line-clamp-3 mb-4">
                          {devotion.excerpt}
                        </p>
                        {devotion.content && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground pointer-events-none"
                          >
                            <span className="w-full inline-flex items-center justify-center">
                              Read More
                              <ArrowRight className="w-3 h-3 ml-2" />
                            </span>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </HoverAnimation>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* Key Themes Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary text-center mb-12">
            What We Explore
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <ScrollAnimation direction="up" delay={0.2}>
              <div className="bg-white rounded-lg p-6 border border-border h-full flex flex-col">
                <h3 className="font-heading font-bold text-lg text-primary mb-3">
                  Jesus' Methods
                </h3>
                <p className="text-foreground/70 flex-grow">
                  Understanding and applying the compassionate, personal approach
                  Jesus used in reaching hearts and spreading the Gospel
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.3}>
              <div className="bg-white rounded-lg p-6 border border-border h-full flex flex-col">
                <h3 className="font-heading font-bold text-lg text-primary mb-3">
                  Biblical Foundation
                </h3>
                <p className="text-foreground/70 flex-grow">
                  Grounding our evangelism in Scripture, drawing from the Great
                  Commission and apostolic witness
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.4}>
              <div className="bg-white rounded-lg p-6 border border-border h-full flex flex-col">
                <h3 className="font-heading font-bold text-lg text-primary mb-3">
                  Ellen G. White Insights
                </h3>
                <p className="text-foreground/70 flex-grow">
                  Learning from "Evangelism (Ivugabutumwa)" and other inspired
                  writings on sharing faith effectively
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary text-center mb-8">
            A Community of Prayer
          </h2>

          <p className="text-foreground/70 text-lg leading-relaxed mb-8">
            The daily devotion program is more than just a meeting—it's a
            spiritual community where young professionals connect with each
            other, strengthen their faith, and grow together in their
            understanding of evangelism. Every member is invited to lead a
            session, ensuring everyone plays an active role in our spiritual
            growth.
          </p>

          <div className="bg-accent/10 rounded-lg p-8 border-l-4 border-accent">
            <p className="font-serif italic text-lg text-primary mb-3">
              "And this gospel shall be preached in all the world for a witness
              unto all nations; and then shall the end come."
            </p>
            <p className="text-foreground/70">— Matthew 24:14</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="join" className="py-16 md:py-24 bg-primary text-primary-foreground scroll-mt-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation direction="fade" delay={0.2}>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
              Join Us Today
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Connect with other young SDA professionals in prayer and spiritual
              growth every day at 6:00 AM.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-base font-semibold rounded-lg"
              >
                <a
                  href="https://chat.whatsapp.com/DIKintfrZjbARzYMQ1SQbN"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join WhatsApp Community
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white text-black bg-white hover:bg-white/90 hover:text-black px-8 py-6 text-base font-semibold rounded-lg transition-all"
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </Layout>
  );
}
