import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { History, Users, Zap } from "lucide-react";

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-secondary to-primary py-16 md:py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
            Our Journey
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            The history and growth of SYPE Ministry—from humble beginnings to
            impactful evangelism
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-12">
            Our Story
          </h2>

          <div className="max-w-3xl mx-auto space-y-8 text-foreground/80 leading-relaxed">
            <div className="relative pl-6 border-l-4 border-accent">
              <h3 className="font-heading font-bold text-xl text-primary mb-3">
                The Beginning: 2019
              </h3>
              <p>
                SYPE Ministry emerged from evangelistic efforts within ASA UR
                Nyarugenge (formerly ASA KIST/KHI), where house-to-house
                evangelism and mission camps were regularly conducted. The
                ministry began with dedicated members sharing the Gospel
                systematically and organically through their professional
                talents.
              </p>
            </div>

            <div className="relative pl-6 border-l-4 border-secondary">
              <h3 className="font-heading font-bold text-xl text-primary mb-3">
                The Catalyst: August 2019
              </h3>
              <p>
                During a mission camp held in Nyacyonga in August 2019, led by
                Mugisha Faustin (ASI Ministry member), young men and women
                raised important concerns about the lack of continuity and
                structure in evangelism efforts. This discussion sparked the
                vision for a more organized, sustainable approach to ministry.
              </p>
            </div>

            <div className="relative pl-6 border-l-4 border-primary">
              <h3 className="font-heading font-bold text-xl text-primary mb-3">
                Official Establishment: September 14, 2019
              </h3>
              <p>
                The first official SYPE Ministry meeting was held on September
                14, 2019, bringing together committed young professionals to
                establish structured, consistent, and impactful evangelism. This
                marked the formal founding of SYPE as an organized ministry
                dedicated to mobilizing young SDA professionals.
              </p>
            </div>

            <div className="relative pl-6 border-l-4 border-accent">
              <h3 className="font-heading font-bold text-xl text-primary mb-3">
                Official Activities Launch: April 2020
              </h3>
              <p>
                Official activities were launched in April 2020, shortly after
                COVID-19 arrived in Rwanda. Despite these challenging
                circumstances, SYPE adapted and began producing innovative
                evangelism content and materials to reach people through digital
                channels.
              </p>
            </div>

            <div className="relative pl-6 border-l-4 border-secondary">
              <h3 className="font-heading font-bold text-xl text-primary mb-3">
                Growth & Innovation
              </h3>
              <p>
                From small beginnings, SYPE has grown into a dynamic ministry
                producing posters, videos, written content, evangelistic
                missions, prayer programs, and digital outreach. The ministry
                remains open to innovative methods of evangelism, always seeking
                to reach more people with the Gospel message through various
                media platforms and outreach initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Message Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <blockquote className="border-l-4 border-primary pl-6 py-4 mb-8">
              <p className="text-2xl font-serif italic text-foreground mb-4">
                "Though we never imagined managing large-scale projects, today
                we handle initiatives worth over 200,000 RWF—and we are
                preparing for projects worth millions."
              </p>
              <footer className="text-lg font-semibold text-primary">
                — Elder Ndacyayishima Justin, President (Alumni Coordination)
              </footer>
            </blockquote>
            <p className="text-foreground/70 leading-relaxed">
              This testament reflects the remarkable growth and vision of SYPE
              Ministry. What began as a desire to bring structure to evangelism
              has blossomed into a significant ministry producing and managing
              substantial evangelical projects that impact communities across
              Kigali and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary text-center mb-12">
            Our Core Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <History className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="font-heading font-bold text-lg text-primary mb-3">
                Structured Organization
              </h3>
              <p className="text-foreground/70">
                Everything done according to well-matured plans and systems,
                trusting God with our sacred work.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-8 h-8 text-secondary" />
                </div>
              </div>
              <h3 className="font-heading font-bold text-lg text-primary mb-3">
                Youth Empowerment
              </h3>
              <p className="text-foreground/70">
                Recognizing young professionals as the potential of the church,
                equipping them for active ministry.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-accent/30 rounded-lg flex items-center justify-center">
                  <Zap className="w-8 h-8 text-accent-foreground" />
                </div>
              </div>
              <h3 className="font-heading font-bold text-lg text-primary mb-3">
                Innovation & Excellence
              </h3>
              <p className="text-foreground/70">
                Using God-given talents and professions creatively to spread the
                Gospel through various media and methods.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Committee Structure Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-12">
            Leadership & Departments
          </h2>

          <div className="max-w-4xl mx-auto">
            <p className="text-foreground/70 text-lg mb-8 leading-relaxed">
              SYPE is led by a dedicated transitional committee with clear roles
              and responsibilities. Each department works together to fulfill
              our mission of equipping young professionals for effective
              evangelism.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white rounded-lg p-6 border border-border">
                <h3 className="font-heading font-bold text-primary mb-2">
                  Student Coordination
                </h3>
                <p className="text-foreground/70 text-sm">
                  Mobilizing students, coordinating activities and engagement
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-border">
                <h3 className="font-heading font-bold text-primary mb-2">
                  Alumni Coordination
                </h3>
                <p className="text-foreground/70 text-sm">
                  Mobilizing alumni professionals, coordination of activities
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-border">
                <h3 className="font-heading font-bold text-primary mb-2">
                  Documentation & Records
                </h3>
                <p className="text-foreground/70 text-sm">
                  Managing meetings, member registrations, and project archives
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-border">
                <h3 className="font-heading font-bold text-primary mb-2">
                  Communications
                </h3>
                <p className="text-foreground/70 text-sm">
                  Public relations, member recruitment, and announcements
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-border">
                <h3 className="font-heading font-bold text-primary mb-2">
                  Technical & Digital Assets
                </h3>
                <p className="text-foreground/70 text-sm">
                  Managing YouTube channels, emails, and digital platforms
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-border">
                <h3 className="font-heading font-bold text-primary mb-2">
                  Project Management
                </h3>
                <p className="text-foreground/70 text-sm">
                  Follow-up on implementation and assessment of results
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
            Be Part of Our Story
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Join SYPE Ministry and contribute your talents and profession to
            spreading the Gospel effectively across communities.
          </p>
          <Button
            asChild
            className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-base font-semibold rounded-lg"
          >
            <Link to="/membership">Join SYPE Today</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
