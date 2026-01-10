import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Megaphone,
  Zap,
  CheckCircle2,
  Users,
  Heart,
  Video,
  Image as ImageIcon,
  FileText,
  Handshake,
  BarChart3,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import ScrollAnimation, { StaggerContainer, HoverAnimation } from "@/components/ScrollAnimation";

export default function Departments() {
  const departments = [
    {
      icon: Megaphone,
      title: "Communication Department",
      subtitle: "External & Internal Relations",
      description:
        "Responsible for public relations, member recruitment, formal announcements, and external communication.",
      responsibilities: [
        "Manage public relations and media outreach",
        "Recruit new members and communicate benefits",
        "Make official ministry announcements",
        "Represent SYPE to external organizations",
      ],
    },
    {
      icon: Zap,
      title: "Public Evangelism Department",
      subtitle: "Spreading the Gospel",
      description:
        "Focused on organizing and conducting evangelistic activities, outreach programs, and mission camps.",
      responsibilities: [
        "Organize evangelistic events and campaigns",
        "Coordinate house-to-house evangelism",
        "Plan and execute mission camps",
        "Train members in evangelistic methods",
      ],
    },
    {
      icon: Users,
      title: "Fellowship Department",
      subtitle: "Building Community",
      description:
        "Responsible for fostering spiritual growth, building relationships, and creating a supportive community among members.",
      responsibilities: [
        "Organize fellowship meetings and activities",
        "Facilitate spiritual growth programs",
        "Build community among members",
        "Coordinate prayer and worship sessions",
      ],
    },
    {
      icon: Heart,
      title: "Prayers Department",
      subtitle: "Spiritual Foundation",
      description:
        "In charge of prayer ministry, intercessory prayer, and spiritual support for members and ministry activities.",
      responsibilities: [
        "Organize prayer meetings and sessions",
        "Coordinate intercessory prayers",
        "Provide spiritual support for members",
        "Lead daily devotion programs",
      ],
    },
    {
      icon: Video,
      title: "Video Preparation",
      subtitle: "Multimedia Content Creation",
      description:
        "Responsible for creating, editing, and producing video content for ministry use, including sermons, teachings, and promotional materials.",
      responsibilities: [
        "Record and edit video content",
        "Produce sermons and teaching videos",
        "Create promotional and documentary videos",
        "Manage video distribution and publishing",
      ],
    },
    {
      icon: ImageIcon,
      title: "Poster Preparation",
      subtitle: "Visual Communication",
      description:
        "In charge of designing and creating visual materials including posters, graphics, flyers, and promotional content.",
      responsibilities: [
        "Design posters and promotional materials",
        "Create graphics for events and campaigns",
        "Develop visual branding materials",
        "Manage visual content library",
      ],
    },
    {
      icon: FileText,
      title: "Publishing Preparation",
      subtitle: "Content Publishing",
      description:
        "Responsible for preparing, editing, and publishing written content including articles, newsletters, and documentation.",
      responsibilities: [
        "Edit and prepare written content for publication",
        "Manage publishing schedules",
        "Coordinate with writers and contributors",
        "Ensure content quality and consistency",
      ],
    },
    {
      icon: Heart,
      title: "Health Department",
      subtitle: "Health & Wellness Ministry",
      description:
        "Focused on promoting health and wellness through education, health programs, and lifestyle counseling based on Adventist health principles.",
      responsibilities: [
        "Organize health education programs",
        "Promote healthy lifestyle principles",
        "Provide health counseling and support",
        "Coordinate health-related activities and campaigns",
      ],
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-secondary to-primary py-16 md:py-20 text-primary-foreground">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <div className="absolute top-10 right-10 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </motion.div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <ScrollAnimation direction="scale" delay={0.2}>
            <motion.h1
              className="font-heading font-bold text-4xl md:text-5xl mb-4"
              animate={{
                textShadow: [
                  "0 0 0px rgba(255,255,255,0)",
                  "0 0 20px rgba(255,255,255,0.3)",
                  "0 0 0px rgba(255,255,255,0)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Our Departments
            </motion.h1>
          </ScrollAnimation>
          <ScrollAnimation direction="fade" delay={0.6}>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Organized structure with specialized departments working together to
              advance our evangelical mission
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <ScrollAnimation direction="up" delay={0.2}>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-6">
              Our Organization
            </h2>
          </ScrollAnimation>
          <ScrollAnimation direction="fade" delay={0.4}>
            <p className="text-foreground/70 text-lg leading-relaxed mb-6">
              SYPE Ministry operates through a dedicated committee structure with
              eight specialized departments. Each department has clear roles and
              responsibilities to ensure our ministry runs efficiently and
              effectively.
            </p>
          </ScrollAnimation>
          <ScrollAnimation direction="fade" delay={0.6}>
            <motion.p
              className="text-foreground/70 text-lg leading-relaxed border-l-4 border-primary pl-6 italic"
              whileHover={{ borderColor: "rgba(59, 130, 246, 0.8)", x: 5 }}
              transition={{ duration: 0.3 }}
            >
              Our organizational approach follows Ellen G. White's principle:
              "Everything must be done according to a well-matured plan, and with
              system. God has entrusted His sacred work to men, and He asks that
              they shall do it carefully."
            </motion.p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <StaggerContainer
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            staggerDelay={0.3}
            direction="scale"
            detectScrollDirection
          >
            {departments.map((dept, idx) => {
              const IconComponent = dept.icon;
              return (
                <HoverAnimation key={idx} scale={1.02} y={-5}>
                  <motion.div
                    className="bg-white rounded-lg p-8 border border-border hover:shadow-2xl transition-all bg-gradient-to-br from-white to-primary/5 relative overflow-hidden group"
                    whileHover={{
                      borderColor: "rgba(59, 130, 246, 0.5)",
                      rotateY: 2,
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Animated background gradient */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                    <div className="relative z-10">
                      <div className="flex items-start gap-4 mb-4">
                        <motion.div
                          className="p-3 bg-primary/10 rounded-lg flex-shrink-0 group-hover:bg-primary/20 transition-colors"
                          whileHover={{ rotate: 360, scale: 1.2 }}
                          transition={{ duration: 0.6 }}
                        >
                          <IconComponent className="w-6 h-6 text-primary" />
                        </motion.div>
                        <div className="flex-1">
                          <motion.h3
                            className="font-heading font-bold text-xl text-primary"
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            {dept.title}
                          </motion.h3>
                          <p className="text-primary text-sm font-semibold">
                            {dept.subtitle}
                          </p>
                        </div>
                      </div>

                      <motion.p
                        className="text-foreground/80 mb-5 leading-relaxed"
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {dept.description}
                      </motion.p>

                      <div>
                        <motion.p
                          className="font-heading font-semibold text-primary mb-3"
                          whileHover={{ x: 5 }}
                        >
                          Key Responsibilities:
                        </motion.p>
                        <motion.ul
                          className="space-y-2"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.2 + 0.6 }}
                        >
                          {dept.responsibilities.map((resp, respIdx) => (
                            <motion.li
                              key={respIdx}
                              className="flex gap-2 text-foreground/70 text-sm"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: respIdx * 0.1 + idx * 0.2 + 0.8 }}
                              whileHover={{ x: 5, color: "rgba(59, 130, 246, 1)" }}
                            >
                              <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  repeatDelay: 3,
                                  delay: respIdx * 0.2,
                                }}
                              >
                                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                              </motion.div>
                              <span>{resp}</span>
                            </motion.li>
                          ))}
                        </motion.ul>
                      </div>
                    </div>
                  </motion.div>
                </HoverAnimation>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Collaboration Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-8">
            Working Together
          </h2>

          <div className="space-y-6 mb-8">
            <div className="bg-accent/10 rounded-lg p-6 border-l-4 border-accent">
              <div className="flex items-center gap-2 mb-2">
                <Handshake className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-lg text-primary">
                  Cross-Departmental Collaboration
                </h3>
              </div>
              <p className="text-foreground/70">
                Our departments don't work in isolation. They collaborate
                closely to ensure projects succeed, communication is clear, and
                members are engaged and supported.
              </p>
            </div>

            <div className="bg-primary/10 rounded-lg p-6 border-l-4 border-primary">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-lg text-primary">
                  Unified Vision
                </h3>
              </div>
              <p className="text-foreground/70">
                Every department contributes to our shared mission: equipping
                young SDA professionals to spread the Gospel through their
                talents and professions.
              </p>
            </div>

            <div className="bg-secondary/10 rounded-lg p-6 border-l-4 border-secondary">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-lg text-primary">
                  Specialized Excellence
                </h3>
              </div>
              <p className="text-foreground/70">
                Each department brings specialized expertise, ensuring our work
                maintains the highest standards and reaches the widest audience.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-8 border-2 border-primary">
            <h3 className="font-heading font-bold text-xl text-primary mb-4">
              Support Our Departments
            </h3>
            <p className="text-foreground/70 mb-4 leading-relaxed">
              If you're interested in serving in any of these departments or
              have skills that could benefit SYPE Ministry, we'd love to hear
              from you. Join our ministry and contribute your talents to
              spreading the Gospel.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              Get Involved <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* WhatsApp Training Group Section */}
      <section className="py-16 md:py-24 bg-white">
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
