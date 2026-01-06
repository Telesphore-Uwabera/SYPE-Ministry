import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import {
  Target,
  Rocket,
  Sprout,
  Users,
  BookOpen,
  Play,
  Newspaper,
} from "lucide-react";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-secondary to-primary py-20 md:py-32 text-primary-foreground">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
            Equipping Young Professionals for Evangelism
          </h1>
          <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8 opacity-95">
            Seventh-day Adventist Young Professionals united to spread the
            Gospel through talents, professions, and service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-base font-semibold rounded-lg"
            >
              <Link to="/membership">Join the Ministry</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 px-8 py-6 text-base font-semibold rounded-lg"
            >
              <Link to="/donations">Support Evangelism</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Snapshot Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-6">
              Who We Are
            </h2>
            <p className="text-foreground/80 text-lg leading-relaxed mb-8">
              SYPE (Seventh-day Adventist Young Professionals in Evangelism) is
              a ministry uniting alumni and students from Adventist Associations
              in public universities in Kigali and beyond, dedicated to
              structured, consistent, and impactful evangelism.
            </p>
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg"
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission & Purpose Cards Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary text-center mb-12">
            Our Mission & Purpose
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Purpose Card */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-border hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <h3 className="font-heading font-bold text-xl text-primary text-center mb-4">
                Purpose
              </h3>
              <p className="text-foreground/80 text-center">
                Connecting and equipping young SDA professionals for active
                evangelism
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-border hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="font-heading font-bold text-xl text-primary text-center mb-4">
                Mission
              </h3>
              <p className="text-foreground/80 text-center">
                Enabling professionals to serve through evangelical projects and
                outreach
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-border hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
                  <Sprout className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="font-heading font-bold text-xl text-primary text-center mb-4">
                Vision
              </h3>
              <p className="text-foreground/80 text-center">
                Sustainable, organized, and innovative evangelism strategies
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Evangelical Impact Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary text-center mb-12">
            Evangelical Impact
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Stat Card */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-4xl font-heading font-bold text-primary mb-2">
                150+
              </p>
              <p className="text-foreground/70 font-medium">Active Members</p>
            </div>

            {/* Stat Card */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-secondary" />
                </div>
              </div>
              <p className="text-4xl font-heading font-bold text-secondary mb-2">
                25+
              </p>
              <p className="text-foreground/70 font-medium">
                Evangelical Projects
              </p>
            </div>

            {/* Stat Card */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-accent/30 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-accent-foreground" />
                </div>
              </div>
              <p className="text-4xl font-heading font-bold text-primary mb-2">
                100+
              </p>
              <p className="text-foreground/70 font-medium">Media Resources</p>
            </div>

            {/* Stat Card */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-4xl font-heading font-bold text-primary mb-2">
                52
              </p>
              <p className="text-foreground/70 font-medium">
                Prayer & Outreach Programs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary text-center mb-12">
            Featured Content
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Latest News Card */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Newspaper className="w-16 h-16 text-primary opacity-40" />
              </div>
              <div className="p-6">
                <h3 className="font-heading font-semibold text-lg text-primary mb-3">
                  Latest News
                </h3>
                <p className="text-foreground/70 text-sm mb-4">
                  Stay updated with the latest ministry announcements, events,
                  and mission reports.
                </p>
                <Link
                  to="/news"
                  className="inline-flex items-center text-accent font-semibold hover:text-accent-foreground transition-colors"
                >
                  Read News
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </div>

            {/* Recent Devotions Card */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-secondary opacity-40" />
              </div>
              <div className="p-6">
                <h3 className="font-heading font-semibold text-lg text-primary mb-3">
                  Devotions
                </h3>
                <p className="text-foreground/70 text-sm mb-4">
                  Weekly prayer and reflection using Jesus' methods. Every
                  Sunday 6:00 PM - 7:00 PM.
                </p>
                <Link
                  to="/devotions"
                  className="inline-flex items-center text-accent font-semibold hover:text-accent-foreground transition-colors"
                >
                  View Devotions
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </div>

            {/* Latest Videos Card */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                <Play className="w-16 h-16 text-accent-foreground opacity-40" />
              </div>
              <div className="p-6">
                <h3 className="font-heading font-semibold text-lg text-primary mb-3">
                  Videos & Multimedia
                </h3>
                <p className="text-foreground/70 text-sm mb-4">
                  Explore sermons, testimonies, evangelism videos, and media
                  resources.
                </p>
                <Link
                  to="/videos"
                  className="inline-flex items-center text-accent font-semibold hover:text-accent-foreground transition-colors"
                >
                  Watch Videos
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Devotions Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-6">
            Weekly Devotion Program
          </h2>
          <p className="text-foreground/70 text-lg max-w-3xl mb-8 leading-relaxed">
            Join us every Sunday from 6:00 PM to 7:00 PM for an hour of prayer
            and spiritual reflection. Our weekly devotion program is guided by
            Jesus' methods and Ellen G. White's teachings on Evangelism
            (Ivugabutumwa).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-accent/10 rounded-lg p-6 border border-accent/30">
              <h3 className="font-heading font-bold text-lg text-primary mb-3">
                🙏 Prayer & Reflection
              </h3>
              <p className="text-foreground/70 text-sm">
                Focused discussion about Jesus' evangelism methods and biblical
                principles for sharing faith
              </p>
            </div>

            <div className="bg-accent/10 rounded-lg p-6 border border-accent/30">
              <h3 className="font-heading font-bold text-lg text-primary mb-3">
                📖 Ellen G. White Study
              </h3>
              <p className="text-foreground/70 text-sm">
                Explore insights from "Evangelism (Ivugabutumwa)" and apply
                them to modern ministry
              </p>
            </div>

            <div className="bg-accent/10 rounded-lg p-6 border border-accent/30">
              <h3 className="font-heading font-bold text-lg text-primary mb-3">
                💬 Community Sharing
              </h3>
              <p className="text-foreground/70 text-sm">
                Connect with other young professionals and share prayer requests
                together
              </p>
            </div>
          </div>

          <p className="text-foreground/70 text-center">
            <strong>When:</strong> Every Sunday, 6:00 PM – 7:00 PM <br />
            <strong>Where:</strong> WhatsApp Community Group
          </p>
        </div>
      </section>

      {/* Videos & Multimedia Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-12">
            Videos & Multimedia
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-lg transition-shadow">
              <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <Play className="w-12 h-12 text-primary opacity-40" />
              </div>
              <div className="p-6">
                <h3 className="font-heading font-bold text-lg text-primary mb-2">
                  Sermons & Teachings
                </h3>
                <p className="text-foreground/70 text-sm mb-4">
                  Inspiring sermons and biblical teachings to deepen your faith
                  and understanding of God's Word
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-lg transition-shadow">
              <div className="h-40 bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
                <Play className="w-12 h-12 text-secondary opacity-40" />
              </div>
              <div className="p-6">
                <h3 className="font-heading font-bold text-lg text-primary mb-2">
                  Evangelism Videos
                </h3>
                <p className="text-foreground/70 text-sm mb-4">
                  Practical videos demonstrating Jesus' methods and effective
                  ways to share the Gospel with others
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-lg transition-shadow">
              <div className="h-40 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                <Play className="w-12 h-12 text-accent-foreground opacity-40" />
              </div>
              <div className="p-6">
                <h3 className="font-heading font-bold text-lg text-primary mb-2">
                  Testimonies
                </h3>
                <p className="text-foreground/70 text-sm mb-4">
                  Real stories of transformation and faith from members of the
                  SYPE community
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-lg transition-shadow">
              <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Play className="w-12 h-12 text-primary opacity-40" />
              </div>
              <div className="p-6">
                <h3 className="font-heading font-bold text-lg text-primary mb-2">
                  Graphics & Posters
                </h3>
                <p className="text-foreground/70 text-sm mb-4">
                  Visual content for social media sharing and evangelistic
                  outreach
                </p>
              </div>
            </div>
          </div>

          <p className="text-foreground/70 text-center text-lg">
            <strong>Follow our YouTube channel and social media</strong> for the
            latest videos and multimedia content
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Join SYPE Ministry and be part of a movement spreading the Gospel
            through your talents, profession, and service.
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
