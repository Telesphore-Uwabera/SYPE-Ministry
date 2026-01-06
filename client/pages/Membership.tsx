import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  Network,
  Trophy,
  CheckCircle2,
  Heart,
} from "lucide-react";

export default function Membership() {
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
                    Any Seventh-day Adventist member from Adventist Student
                    Associations (ASSAs) who is willing to support and
                    participate in SYPE's evangelical mission.
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
              <h3 className="font-heading font-bold text-xl text-primary mb-3">
                📱 WhatsApp Community
              </h3>
              <p className="text-foreground/70 mb-3 leading-relaxed">
                Our WhatsApp group is the hub of member communication and
                coordination, sharing only approved evangelism materials to keep
                focused and avoid information overload.
              </p>
            </div>

            <div className="bg-accent/10 rounded-lg p-6 border-l-4 border-accent">
              <h3 className="font-heading font-bold text-lg text-primary mb-3">
                🙏 Weekly Prayer & Devotion Program
              </h3>
              <p className="text-foreground/70 mb-2">
                <strong>Time:</strong> Every Sunday, 6:00 PM – 7:00 PM
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
              <h3 className="font-heading font-bold text-xl text-primary mb-3">
                🎯 Project Participation
              </h3>
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
    </Layout>
  );
}
