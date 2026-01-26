import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Member } from "@/types/admin";
import { buildApiUrl } from "@/lib/apiConfig";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  Network,
  Trophy,
  CheckCircle2,
  Heart,
  MessageCircle,
  Target,
} from "lucide-react";

export default function Membership() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(buildApiUrl("/api/admin/members"));
        const data = await response.json();
        if (Array.isArray(data)) {
          setMembers(data.filter((m: Member) => m.status === "Active"));
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const benefits = [
    {
      icon: BookOpen,
      title: "Evangelism Training",
      description:
        "Structured training in evangelism methods and biblical principles",
    },
    {
      icon: Network,
      title: "Mentorship Programs",
      description: "Connect with experienced mentors and spiritual leaders",
    },
    {
      icon: Users,
      title: "Project Participation",
      description:
        "Participate in impactful evangelical projects and initiatives",
    },
    {
      icon: Trophy,
      title: "Leadership Development",
      description: "Develop leadership skills and take on ministry roles",
    },
    {
      icon: Heart,
      title: "Community Support",
      description: "Network with like-minded young professionals",
    },
    {
      icon: BookOpen,
      title: "Media & Resources",
      description: "Access exclusive evangelism materials and content",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-secondary to-primary py-16 md:py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
            Become a Member
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Join a community of young professionals committed to spreading the
            Gospel through their talents and professions
          </p>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-8">
              Membership Eligibility
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent/30">
                    <CheckCircle2 className="h-6 w-6 text-accent-foreground" />
                  </div>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-primary mb-2">
                    Active SDA Member in ASSA
                  </h3>
                  <p className="text-foreground/70">
                    Seventh-day Adventist member from Adventist Student and Alumni Associations (ASSA Kigali) Plus any other location.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent/30">
                    <CheckCircle2 className="h-6 w-6 text-accent-foreground" />
                  </div>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-primary mb-2">
                    Commitment to the Mission
                  </h3>
                  <p className="text-foreground/70">
                    Demonstrate commitment to achieving the goals of SYPE's
                    purpose and mission of equipping professionals for
                    evangelism.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent/30">
                    <CheckCircle2 className="h-6 w-6 text-accent-foreground" />
                  </div>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-primary mb-2">
                    Invitation-Based Membership
                  </h3>
                  <p className="text-foreground/70">
                    Any existing SYPE member can invite a committed person to
                    join the ministry, bringing in partners who share our
                    evangelistic vision.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary text-center mb-12">
            Member Benefits
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => {
              const IconComponent = benefit.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-6 border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-primary text-center mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-foreground/70 text-center text-sm">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Member Engagement Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-8">
            Member Engagement
          </h2>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-xl text-primary">
                  WhatsApp Community
                </h3>
              </div>
              <p className="text-foreground/70 mb-3 leading-relaxed">
                Our WhatsApp group is the hub of member communication and
                coordination, sharing only approved evangelism materials to keep
                focused and avoid information overload.
              </p>
            </div>

            <div className="bg-accent/10 rounded-lg p-6 border-l-4 border-accent">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-lg text-primary">
                  Daily Prayer & Devotion Program
                </h3>
              </div>
              <p className="text-foreground/70 mb-2">
                <strong>Time:</strong> Every day, 6:00 AM – 7:00 AM
              </p>
              <p className="text-foreground/70 mb-2">
                <strong>Format:</strong> 1 hour of "Jesus Methods" devotion
              </p>
              <p className="text-foreground/70">
                Members discuss insights from Ellen G. White's "Evangelism
                (Ivugabutumwa)" and pray about requests together.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-xl text-primary">
                  Project Participation
                </h3>
              </div>
              <p className="text-foreground/70 mb-3 leading-relaxed">
                Members are invited to participate in various evangelical
                projects. Those interested volunteer for projects that match
                their talents and professions, creating a collaborative approach
                to ministry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Join Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary text-center mb-12">
            How to Join
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="text-foreground/70">
                  <strong>Connect:</strong> Reach out to an existing SYPE member
                  or contact us directly
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="text-foreground/70">
                  <strong>Learn:</strong> Learn more about our mission and
                  commitment
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="text-foreground/70">
                  <strong>Join:</strong> Complete membership registration and
                  join our community
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                4
              </div>
              <div>
                <p className="text-foreground/70">
                  <strong>Engage:</strong> Participate in prayers, projects, and
                  ministry activities
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
            Ready to Join SYPE?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Take the first step toward using your talents and profession for
            evangelism. Contact us to learn more about membership.
          </p>
          <Button
            asChild
            className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-base font-semibold rounded-lg"
          >
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>

      {/* Our Members Section */}
      {!loading && members.length > 0 && (
        <section className="py-16 md:py-24 bg-white relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary text-center mb-12">
              Our Community Members
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {members.slice(0, 100).map((member) => (
                <div
                  key={member.id}
                  className="bg-muted/30 rounded-lg p-5 border border-border flex flex-col items-center text-center hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 text-primary font-bold text-xl">
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="font-heading font-bold text-primary text-lg mb-1 leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-sm text-foreground/60 mb-2">
                    {member.association || "SYPE Community"}
                  </p>
                </div>
              ))}
            </div>
            {members.length > 100 && (
              <p className="text-center mt-8 text-foreground/50">
                And {members.length - 100} more dedicated members...
              </p>
            )}
          </div>
        </section>
      )}

      {/* WhatsApp Training Group Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6 border-2 border-green-500/30">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-primary mb-1">
                      Join Our Training Program
                    </h3>
                    <p className="text-sm text-foreground/70">
                      Connect with members on WhatsApp for training and discussions
                    </p>
                  </div>
                </div>
                <Button
                  asChild
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-6 text-base font-semibold rounded-lg whitespace-nowrap"
                >
                  <a
                    href="https://chat.whatsapp.com/DIKintfrZjbARzYMQ1SQbN"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join WhatsApp Group
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
