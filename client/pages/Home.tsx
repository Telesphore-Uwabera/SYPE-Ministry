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
  Heart,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import ScrollAnimation, { StaggerContainer, HoverAnimation } from "@/components/ScrollAnimation";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      y: -8,
      transition: { duration: 0.3 },
    },
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-secondary to-primary py-20 md:py-32 text-primary-foreground">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <motion.div
          className="container mx-auto px-4 relative z-10 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6"
            variants={itemVariants}
          >
            Equipping Young Professionals for Evangelism
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8 opacity-95"
            variants={itemVariants}
          >
            Seventh-day Adventist Young Professionals united to spread the
            Gospel through talents, professions, and service.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-base font-semibold rounded-lg transition-all"
              >
                <Link to="/membership">Join the Ministry</Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                className="bg-black text-white hover:bg-black/90 px-8 py-6 text-base font-semibold rounded-lg transition-all"
              >
                <Link to="/donations">Support Evangelism</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Snapshot Section */}
      <motion.section
        className="py-16 md:py-24 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              className="font-heading font-bold text-3xl md:text-4xl text-primary mb-6"
              variants={itemVariants}
            >
              Who We Are
            </motion.h2>
            <motion.p
              className="text-foreground/80 text-lg leading-relaxed mb-8"
              variants={itemVariants}
            >
              SYPE (Seventh-day Adventist Young Professionals in Evangelism) is
              a ministry uniting alumni and students from Adventist Associations
              in public universities in Kigali and beyond, dedicated to
              structured, consistent, and impactful evangelism.
            </motion.p>
            <motion.div variants={itemVariants} className="flex gap-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  asChild
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg transition-all"
                >
                  <Link to="/about">Learn More</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  asChild
                  variant="outline"
                  className="border-black text-black hover:bg-black hover:text-white px-6 py-3 rounded-lg transition-all"
                >
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission & Purpose Cards Section */}
      <motion.section
        className="py-16 md:py-24 bg-muted/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="font-heading font-bold text-3xl md:text-4xl text-primary text-center mb-12"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Our Mission & Purpose
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Purpose Card */}
            <motion.div
              className="bg-white rounded-lg p-8 shadow-sm border border-border hover:shadow-lg transition-shadow"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <Target className="w-8 h-8 text-primary-foreground" />
                </motion.div>
              </div>
              <h3 className="font-heading font-bold text-xl text-primary text-center mb-4">
                Purpose
              </h3>
              <p className="text-foreground/80 text-center">
                Connecting and equipping young SDA professionals for active
                evangelism
              </p>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              className="bg-white rounded-lg p-8 shadow-sm border border-border hover:shadow-lg transition-shadow"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <Rocket className="w-8 h-8 text-primary" />
                </motion.div>
              </div>
              <h3 className="font-heading font-bold text-xl text-primary text-center mb-4">
                Mission
              </h3>
              <p className="text-foreground/80 text-center">
                Enabling professionals to serve through evangelical projects and
                outreach
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              className="bg-white rounded-lg p-8 shadow-sm border border-border hover:shadow-lg transition-shadow"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex justify-center mb-6">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <Sprout className="w-8 h-8 text-primary" />
                </motion.div>
              </div>
              <h3 className="font-heading font-bold text-xl text-primary text-center mb-4">
                Vision
              </h3>
              <p className="text-foreground/80 text-center">
                Sustainable, organized, and innovative evangelism strategies
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Evangelical Impact Section */}
      <motion.section
        className="py-16 md:py-24 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="font-heading font-bold text-3xl md:text-4xl text-primary text-center mb-12"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Evangelical Impact
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Stat Card */}
            <motion.div
              className="text-center"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  <Users className="w-6 h-6 text-primary" />
                </motion.div>
              </div>
              <p className="text-4xl font-heading font-bold text-primary mb-2">
                150+
              </p>
              <p className="text-foreground/70 font-medium">Active Members</p>
            </motion.div>

            {/* Stat Card */}
            <motion.div
              className="text-center"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  <Rocket className="w-6 h-6 text-secondary" />
                </motion.div>
              </div>
              <p className="text-4xl font-heading font-bold text-secondary mb-2">
                25+
              </p>
              <p className="text-foreground/70 font-medium">
                Evangelical Projects
              </p>
            </motion.div>

            {/* Stat Card */}
            <motion.div
              className="text-center"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  className="w-12 h-12 bg-accent/30 rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  <BookOpen className="w-6 h-6 text-accent-foreground" />
                </motion.div>
              </div>
              <p className="text-4xl font-heading font-bold text-primary mb-2">
                100+
              </p>
              <p className="text-foreground/70 font-medium">Media Resources</p>
            </motion.div>

            {/* Stat Card */}
            <motion.div
              className="text-center"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  <Target className="w-6 h-6 text-primary" />
                </motion.div>
              </div>
              <p className="text-4xl font-heading font-bold text-primary mb-2">
                52
              </p>
              <p className="text-foreground/70 font-medium">
                Prayer & Outreach Programs
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Content Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="fade" delay={0.4}>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary text-center mb-12">
              Featured Content
            </h2>
          </ScrollAnimation>

          <StaggerContainer detectScrollDirection
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            staggerDelay={0.3}
            direction="up"
          >
            {/* Latest News Card */}
            <HoverAnimation scale={1.02} y={-8}>
              <motion.div
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-xl transition-all duration-300"
                whileHover={{ borderColor: "rgba(59, 130, 246, 0.3)" }}
              >
                <motion.div
                  className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Newspaper className="w-16 h-16 text-primary opacity-40" />
                </motion.div>
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
                    className="inline-flex items-center text-accent font-semibold hover:text-accent-foreground transition-colors group"
                  >
                    Read News
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            </HoverAnimation>

            {/* Recent Devotions Card */}
            <HoverAnimation scale={1.02} y={-8}>
              <motion.div
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-xl transition-all duration-300"
                whileHover={{ borderColor: "rgba(59, 130, 246, 0.3)" }}
              >
                <motion.div
                  className="h-48 bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <BookOpen className="w-16 h-16 text-secondary opacity-40" />
                </motion.div>
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
                    className="inline-flex items-center text-accent font-semibold hover:text-accent-foreground transition-colors group"
                  >
                    View Devotions
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            </HoverAnimation>

            {/* Latest Videos Card */}
            <HoverAnimation scale={1.02} y={-8}>
              <motion.div
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-xl transition-all duration-300"
                whileHover={{ borderColor: "rgba(59, 130, 246, 0.3)" }}
              >
                <motion.div
                  className="h-48 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Play className="w-16 h-16 text-accent-foreground opacity-40" />
                </motion.div>
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
                    className="inline-flex items-center text-accent font-semibold hover:text-accent-foreground transition-colors group"
                  >
                    Watch Videos
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            </HoverAnimation>
          </StaggerContainer>
        </div>
      </section>

      {/* Devotions Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="up" delay={0.4}>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-6">
              Weekly Devotion Program
            </h2>
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={0.4}>
            <p className="text-foreground/70 text-lg max-w-3xl mb-8 leading-relaxed">
              Join us every Sunday from 6:00 PM to 7:00 PM for an hour of prayer
              and spiritual reflection. Our weekly devotion program is guided by
              Jesus' methods and Ellen G. White's teachings on Evangelism
              (Ivugabutumwa).
            </p>
          </ScrollAnimation>

          <StaggerContainer detectScrollDirection
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
            staggerDelay={0.2}
            direction="up"
          >
            <HoverAnimation scale={1.02} y={-5}>
              <motion.div
                className="bg-accent/10 rounded-lg p-6 border border-accent/30 hover:border-accent/50 transition-all"
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.15)" }}
              >
                <motion.div
                  className="flex items-center gap-2 mb-3"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Heart className="w-5 h-5 text-primary" />
                  <h3 className="font-heading font-bold text-lg text-primary">
                    Prayer & Reflection
                  </h3>
                </motion.div>
                <p className="text-foreground/70 text-sm">
                  Focused discussion about Jesus' evangelism methods and biblical
                  principles for sharing faith
                </p>
              </motion.div>
            </HoverAnimation>

            <HoverAnimation scale={1.02} y={-5}>
              <motion.div
                className="bg-accent/10 rounded-lg p-6 border border-accent/30 hover:border-accent/50 transition-all"
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.15)" }}
              >
                <motion.div
                  className="flex items-center gap-2 mb-3"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h3 className="font-heading font-bold text-lg text-primary">
                    Ellen G. White Study
                  </h3>
                </motion.div>
                <p className="text-foreground/70 text-sm">
                  Explore insights from "Evangelism (Ivugabutumwa)" and apply them
                  to modern ministry
                </p>
              </motion.div>
            </HoverAnimation>

            <HoverAnimation scale={1.02} y={-5}>
              <motion.div
                className="bg-accent/10 rounded-lg p-6 border border-accent/30 hover:border-accent/50 transition-all"
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.15)" }}
              >
                <motion.div
                  className="flex items-center gap-2 mb-3"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <h3 className="font-heading font-bold text-lg text-primary">
                    Community Sharing
                  </h3>
                </motion.div>
                <p className="text-foreground/70 text-sm">
                  Connect with other young professionals and share prayer requests
                  together
                </p>
              </motion.div>
            </HoverAnimation>
          </StaggerContainer>

          <ScrollAnimation direction="fade" delay={1.0}>
            <p className="text-foreground/70 text-center">
              <strong>When:</strong> Every Sunday, 6:00 PM – 7:00 PM <br />
              <strong>Where:</strong> WhatsApp Community Group
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Videos & Multimedia Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="fade" delay={0.1}>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-12">
              Videos & Multimedia
            </h2>
          </ScrollAnimation>

          <StaggerContainer detectScrollDirection
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
            staggerDelay={0.2}
            direction="up"
          >
            <HoverAnimation scale={1.02} y={-5}>
              <motion.div
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-xl transition-all duration-300"
                whileHover={{ borderColor: "rgba(59, 130, 246, 0.3)" }}
              >
                <motion.div
                  className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Play className="w-12 h-12 text-primary opacity-40" />
                </motion.div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-lg text-primary mb-2">
                    Sermons & Teachings
                  </h3>
                  <p className="text-foreground/70 text-sm mb-4">
                    Inspiring sermons and biblical teachings to deepen your faith
                    and understanding of God's Word
                  </p>
                </div>
              </motion.div>
            </HoverAnimation>

            <HoverAnimation scale={1.02} y={-5}>
              <motion.div
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-xl transition-all duration-300"
                whileHover={{ borderColor: "rgba(59, 130, 246, 0.3)" }}
              >
                <motion.div
                  className="h-40 bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Play className="w-12 h-12 text-secondary opacity-40" />
                </motion.div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-lg text-primary mb-2">
                    Evangelism Videos
                  </h3>
                  <p className="text-foreground/70 text-sm mb-4">
                    Practical videos demonstrating Jesus' methods and effective
                    ways to share the Gospel with others
                  </p>
                </div>
              </motion.div>
            </HoverAnimation>

            <HoverAnimation scale={1.02} y={-5}>
              <motion.div
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-xl transition-all duration-300"
                whileHover={{ borderColor: "rgba(59, 130, 246, 0.3)" }}
              >
                <motion.div
                  className="h-40 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Play className="w-12 h-12 text-accent-foreground opacity-40" />
                </motion.div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-lg text-primary mb-2">
                    Testimonies
                  </h3>
                  <p className="text-foreground/70 text-sm mb-4">
                    Real stories of transformation and faith from members of the
                    SYPE community
                  </p>
                </div>
              </motion.div>
            </HoverAnimation>

            <HoverAnimation scale={1.02} y={-5}>
              <motion.div
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-xl transition-all duration-300"
                whileHover={{ borderColor: "rgba(59, 130, 246, 0.3)" }}
              >
                <motion.div
                  className="h-40 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Play className="w-12 h-12 text-primary opacity-40" />
                </motion.div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-lg text-primary mb-2">
                    Graphics & Posters
                  </h3>
                  <p className="text-foreground/70 text-sm mb-4">
                    Visual content for social media sharing and evangelistic
                    outreach
                  </p>
                </div>
              </motion.div>
            </HoverAnimation>
          </StaggerContainer>

          <div className="text-center">
            <p className="text-foreground/70 text-lg mb-4">
              <strong>Follow our YouTube channel and social media</strong> for the
              latest videos and multimedia content
            </p>
            <Button
              asChild
              variant="outline"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <a
                href="https://www.youtube.com/@sypeministry5276"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Play className="w-4 h-4 mr-2" />
                Visit Our YouTube Channel
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute top-10 right-10 w-72 h-72 bg-accent rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-10 left-10 w-96 h-96 bg-secondary rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <ScrollAnimation direction="scale" delay={0.2}>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
              Ready to Make a Difference?
            </h2>
          </ScrollAnimation>
          <ScrollAnimation direction="fade" delay={0.4}>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Join SYPE Ministry and be part of a movement spreading the Gospel
              through your talents, profession, and service.
            </p>
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={0.6}>
            <HoverAnimation scale={1.05}>
              <Button
                asChild
                className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Link to="/membership">Join SYPE Today</Link>
              </Button>
            </HoverAnimation>
          </ScrollAnimation>
        </div>
      </section>
    </Layout>
  );
}
