import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Clock, Users, BookOpen, Heart } from "lucide-react";

export default function Devotions() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-secondary to-primary py-16 md:py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
            Weekly Devotion Program
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Join us for weekly prayer and spiritual reflection guided by Jesus'
            methods and Ellen G. White's teachings on Evangelism
          </p>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto items-start">
            {/* Schedule Card */}
            <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg p-8 border border-accent/30">
              <h2 className="font-heading font-bold text-2xl text-primary mb-6">
                📅 Program Schedule
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-primary">Time</p>
                    <p className="text-foreground/70">
                      Every Sunday: 6:00 PM – 7:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-primary">Platform</p>
                    <p className="text-foreground/70">
                      WhatsApp Community Group
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <BookOpen className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-primary">Duration</p>
                    <p className="text-foreground/70">1 hour of focused prayer</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Heart className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-primary">Leadership</p>
                    <p className="text-foreground/70">
                      Rotating member leaders (weekly)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Program Format Card */}
            <div className="bg-white rounded-lg p-8 border border-border shadow-sm">
              <h2 className="font-heading font-bold text-2xl text-primary mb-6">
                🙏 Program Format
              </h2>

              <div className="space-y-4">
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
                    Discuss quotes and teachings from "Evangelism (Ivugabutumwa)"
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
          </div>
        </div>
      </section>

      {/* Key Themes Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary text-center mb-12">
            What We Explore
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 border border-border">
              <h3 className="font-heading font-bold text-lg text-primary mb-3">
                Jesus' Methods
              </h3>
              <p className="text-foreground/70">
                Understanding and applying the compassionate, personal approach
                Jesus used in reaching hearts and spreading the Gospel
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-border">
              <h3 className="font-heading font-bold text-lg text-primary mb-3">
                Biblical Foundation
              </h3>
              <p className="text-foreground/70">
                Grounding our evangelism in Scripture, drawing from the Great
                Commission and apostolic witness
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-border">
              <h3 className="font-heading font-bold text-lg text-primary mb-3">
                Ellen G. White Insights
              </h3>
              <p className="text-foreground/70">
                Learning from "Evangelism (Ivugabutumwa)" and other inspired
                writings on sharing faith effectively
              </p>
            </div>
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
            The weekly devotion program is more than just a meeting—it's a
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
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
            Join Us This Sunday
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Connect with other young SDA professionals in prayer and spiritual
            growth every Sunday at 6:00 PM.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-base font-semibold rounded-lg"
            >
              <a href="#join">Join WhatsApp Group</a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 px-8 py-6 text-base font-semibold rounded-lg"
            >
              <a href="#contact">Contact Us</a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
