import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { History, Users, Zap, MessageCircle, Phone, MapPin, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ScrollAnimation, { StaggerContainer, HoverAnimation } from "@/components/ScrollAnimation";
import { CommitteeMember } from "@/types/admin";
import { buildApiUrl } from "@/lib/apiConfig";

export default function About() {
  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommitteeMembers();
  }, []);

  const loadCommitteeMembers = async () => {
    try {
      const apiUrl = buildApiUrl("/api/committee?active=true");
      console.log("Fetching committee members from:", apiUrl);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Committee members data received:", data);

      if (Array.isArray(data)) {
        setCommitteeMembers(data);
      } else {
        console.warn("Committee members data is not an array:", data);
        setCommitteeMembers([]);
      }
    } catch (error) {
      console.error("Error loading committee members:", error);
      setCommitteeMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const leadershipTeam = committeeMembers.filter(m => m.category === "leadership");
  const teamHeads = committeeMembers.filter(m => m.category === "team");
  const auditorsTeam = committeeMembers.filter(m => m.category === "auditor");
  const asaRepresentatives = committeeMembers.filter(m => m.category === "asa_representatives");
  const boardCounsellors = committeeMembers.filter(m => m.category === "board_counsellors");
  const aboutFaqs = [
    {
      category: "General Information",
      questions: [
        {
          q: "What is SYPE Ministry?",
          a: "SYPE is a ministry that encompasses alumni and students who are part of Seventh-day Adventists' Associations that operate in public Universities in Kigali, grouped in the evangelical district of ASSA Kigali, and welcomes partnership with others who want to participate in evangelism.",
        },
        {
          q: "When was SYPE Ministry established?",
          a: "SYPE Ministry was officially established on September 14, 2019, with official activities launching in April 2020.",
        },
        {
          q: "What is the mission of SYPE Ministry?",
          a: "To enable young professionals in the church to engage in missionary work through evangelical projects that involve their professions and talents.",
        },
        {
          q: "Where is SYPE Ministry located?",
          a: "SYPE Ministry is based in Kigali, Rwanda, and serves young professionals from Adventist Student Associations in public universities in Kigali and beyond.",
        },
      ],
    },
    {
      category: "Membership",
      questions: [
        {
          q: "Who can become a member of SYPE Ministry?",
          a: "Seventh-day Adventist member from Adventist Student and Alumni Associations (ASSA Kigali) Plus any other location.",
        },
        {
          q: "How do I join SYPE Ministry?",
          a: "Membership is invitation-based. You can be invited by an existing SYPE member, or you can contact us directly through our contact page to express your interest in joining.",
        },
        {
          q: "What are the benefits of membership?",
          a: "Members receive evangelism training, mentorship opportunities, project participation, leadership development, community support, and access to exclusive evangelism materials and resources.",
        },
        {
          q: "Is there a membership fee?",
          a: "SYPE Ministry does not charge membership fees. However, members are encouraged to support evangelism projects through voluntary contributions and donations.",
        },
      ],
    },
    {
      category: "Activities & Programs",
      questions: [
        {
          q: "What activities does SYPE Ministry organize?",
          a: "SYPE organizes various activities including daily prayer and devotion programs, evangelism projects, mission camps, media content creation (videos, posters, written content), and digital outreach initiatives.",
        },
        {
          q: "When are the daily devotion programs?",
          a: "Our daily prayer and devotion program takes place every day from 6:00 AM to 7:00 AM via WhatsApp. The program focuses on Jesus' methods and Ellen G. White's teachings on evangelism.",
        },
        {
          q: "How can I participate in evangelism projects?",
          a: "Members are invited to participate in various evangelical projects. Those interested can volunteer for projects that match their talents and professions. Contact us or check with project coordinators for current opportunities.",
        },
      ],
    },
    {
      category: "Contact & Communication",
      questions: [
        {
          q: "How can I contact SYPE Ministry?",
          a: "You can contact us via email at sypeministry@gmail.com, phone at +250 780 430 990 or +250 785 073 847, or through our contact page on the website.",
        },
        {
          q: "Do you have a WhatsApp group?",
          a: (
            <div>
              <p>
                Yes, SYPE has a WhatsApp community group for members. The group is
                used for communication, coordination, and sharing approved evangelism
                materials.
              </p>
              <div className="mt-3">
                <motion.a
                  href="https://chat.whatsapp.com/DIKintfrZjbARzYMQ1SQbN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-green-600 transition-colors"
                  animate={{
                    scale: [1, 1.06, 1],
                    boxShadow: [
                      "0 0 0 rgba(0,0,0,0)",
                      "0 0 20px rgba(34,197,94,0.6)",
                      "0 0 0 rgba(0,0,0,0)",
                    ],
                  }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  Click here to join training WhatsApp group
                </motion.a>
              </div>
            </div>
          ),
        },
      ],
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section id="about-hero" className="relative overflow-hidden bg-gradient-to-r from-primary via-secondary to-primary py-16 md:py-20 text-primary-foreground">
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
              Our Journey
            </motion.h1>
          </ScrollAnimation>
          <ScrollAnimation direction="fade" delay={0.6}>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              The history and growth of SYPE Ministry—from humble beginnings to
              impactful evangelism
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* About SYPE Section */}
      <section id="about-overview" className="py-16 md:py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="fade" delay={0.2}>
            <div className="max-w-5xl mx-auto">
              {/* What is it? Section */}
              <div className="mb-8">
                <div className="bg-primary text-primary-foreground px-6 py-3 rounded-t-lg">
                  <h2 className="font-heading font-bold text-xl md:text-2xl">What is it?</h2>
                </div>
                <div className="bg-primary/5 px-6 py-6 rounded-b-lg border-l-4 border-primary">
                  <p className="text-foreground/90 leading-relaxed text-base md:text-lg">
                    SYPE is a ministry that encompasses alumni and students who are part of Seventh-day Adventists' Associations that operate in public Universities in Kigali, grouped in the evangelical district of ASSA Kigali, and welcomes partnership with others who want to participate in evangelism.
                  </p>
                </div>
              </div>

              {/* PURPOSE Section */}
              <div className="mb-8">
                <div className="bg-primary text-primary-foreground px-6 py-3 rounded-t-lg">
                  <h2 className="font-heading font-bold text-xl md:text-2xl">PURPOSE</h2>
                </div>
                <div className="bg-primary/5 px-6 py-6 rounded-b-lg border-l-4 border-primary">
                  <p className="text-foreground/90 leading-relaxed text-base md:text-lg">
                    To connect and equip young SDA professionals to regularly and actively have part in Evangelism, through their different professions and talents supporting the SDA Church's mission of sharing the Three Angels' Messages of God's love and grace to the world in preparation for His soon return.
                  </p>
                </div>
              </div>

              {/* MISSION Section */}
              <div className="mb-8">
                <div className="bg-primary text-primary-foreground px-6 py-3 rounded-t-lg">
                  <h2 className="font-heading font-bold text-xl md:text-2xl">MISSION</h2>
                </div>
                <div className="bg-primary/5 px-6 py-6 rounded-b-lg border-l-4 border-primary">
                  <p className="text-foreground/90 leading-relaxed text-base md:text-lg">
                    To enable young professionals in the church to engage in missionary work through evangelical projects that involve their professions and talents.
                  </p>
                </div>
              </div>

              {/* WhatsApp Training Group Link */}
              <div className="mt-12 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6 border-2 border-green-500/30">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg text-primary mb-1">
                        Join Our Training Program
                      </h3>
                      <p className="text-sm text-foreground/70">
                        Connect with other members on WhatsApp
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
          </ScrollAnimation>
        </div>
      </section>

      {/* History Section */}
      <section id="about-story" className="py-16 md:py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="up" delay={0.2}>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-12">
              Our Story
            </h2>
          </ScrollAnimation>

          <div className="max-w-3xl mx-auto relative">
            {/* Vertical Timeline Line */}
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent via-secondary to-primary"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            <StaggerContainer
              className="space-y-8 text-foreground/80 leading-relaxed"
              staggerDelay={0.4}
              direction="left"
              detectScrollDirection
            >
              {/* Timeline Item 1 */}
              <motion.div
                className="relative pl-8"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="absolute left-0 top-0 w-4 h-4 bg-accent rounded-full border-4 border-white shadow-lg"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
                  whileHover={{ scale: 1.3 }}
                />
                <motion.div
                  className="border-l-4 border-accent pl-6 py-4 rounded-r-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
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
                </motion.div>
              </motion.div>

              {/* Timeline Item 2 */}
              <motion.div
                className="relative pl-8"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="absolute left-0 top-0 w-4 h-4 bg-secondary rounded-full border-4 border-white shadow-lg"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 1.0 }}
                  whileHover={{ scale: 1.3 }}
                />
                <motion.div
                  className="border-l-4 border-secondary pl-6 py-4 rounded-r-lg bg-secondary/5 hover:bg-secondary/10 transition-colors"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
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
                </motion.div>
              </motion.div>

              {/* Timeline Item 3 */}
              <motion.div
                className="relative pl-8"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="absolute left-0 top-0 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 1.4 }}
                  whileHover={{ scale: 1.3 }}
                />
                <motion.div
                  className="border-l-4 border-primary pl-6 py-4 rounded-r-lg bg-primary/5 hover:bg-primary/10 transition-colors"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
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
                </motion.div>
              </motion.div>

              {/* Timeline Item 4 */}
              <motion.div
                className="relative pl-8"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="absolute left-0 top-0 w-4 h-4 bg-accent rounded-full border-4 border-white shadow-lg"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 1.8 }}
                  whileHover={{ scale: 1.3 }}
                />
                <motion.div
                  className="border-l-4 border-accent pl-6 py-4 rounded-r-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1.6 }}
                >
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
                </motion.div>
              </motion.div>

              {/* Timeline Item 5 */}
              <motion.div
                className="relative pl-8"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="absolute left-0 top-0 w-4 h-4 bg-secondary rounded-full border-4 border-white shadow-lg"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 2.2 }}
                  whileHover={{ scale: 1.3 }}
                />
                <motion.div
                  className="border-l-4 border-secondary pl-6 py-4 rounded-r-lg bg-secondary/5 hover:bg-secondary/10 transition-colors"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 2.0 }}
                >
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
                </motion.div>
              </motion.div>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Leadership Message Section */}
      <section id="about-leadership-message" className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <ScrollAnimation direction="right" delay={0.2}>
              <motion.blockquote
                className="border-l-4 border-primary pl-6 py-4 mb-8 relative"
                whileHover={{ borderColor: "rgba(59, 130, 246, 0.8)", x: 5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute -left-2 top-0 bottom-0 w-1 bg-primary rounded-full"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />
                <motion.p
                  className="text-2xl font-serif italic text-foreground mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  "Though we never imagined managing large-scale projects, today
                  we handle initiatives worth over 200,000 RWF—and we are
                  preparing for projects worth millions."
                </motion.p>
                <motion.footer
                  className="text-lg font-semibold text-primary"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  — Elder Ndacyayishima Justin, President (Alumni Coordination)
                </motion.footer>
              </motion.blockquote>
            </ScrollAnimation>
            <ScrollAnimation direction="fade" delay={0.8}>
              <p className="text-foreground/70 leading-relaxed">
                This testament reflects the remarkable growth and vision of SYPE
                Ministry. What began as a desire to bring structure to evangelism
                has blossomed into a significant ministry producing and managing
                substantial evangelical projects that impact communities across
                Kigali and beyond.
              </p>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section id="about-values" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="scale" delay={0.2}>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary text-center mb-12">
              Our Core Values
            </h2>
          </ScrollAnimation>

          <StaggerContainer
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            staggerDelay={0.3}
            direction="up"
          >
            <HoverAnimation scale={1.05} y={-8}>
              <motion.div
                className="text-center bg-gradient-to-br from-white to-primary/5 rounded-xl p-6 border border-primary/20 hover:border-primary/40 transition-all"
                whileHover={{
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.15)",
                  rotateY: 5,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="flex justify-center mb-6"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center"
                    whileHover={{ scale: 1.2, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
                  >
                    <History className="w-8 h-8 text-primary" />
                  </motion.div>
                </motion.div>
                <h3 className="font-heading font-bold text-lg text-primary mb-3">
                  Structured Organization
                </h3>
                <p className="text-foreground/70">
                  Everything done according to well-matured plans and systems,
                  trusting God with our sacred work.
                </p>
              </motion.div>
            </HoverAnimation>

            <HoverAnimation scale={1.05} y={-8}>
              <motion.div
                className="text-center bg-gradient-to-br from-white to-secondary/5 rounded-xl p-6 border border-secondary/20 hover:border-secondary/40 transition-all"
                whileHover={{
                  boxShadow: "0 20px 40px rgba(147, 51, 234, 0.15)",
                  rotateY: -5,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="flex justify-center mb-6"
                  whileHover={{ rotate: -360 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center"
                    whileHover={{ scale: 1.2, backgroundColor: "rgba(147, 51, 234, 0.2)" }}
                  >
                    <Users className="w-8 h-8 text-secondary" />
                  </motion.div>
                </motion.div>
                <h3 className="font-heading font-bold text-lg text-primary mb-3">
                  Youth Empowerment
                </h3>
                <p className="text-foreground/70">
                  Recognizing young professionals as the potential of the church,
                  equipping them for active ministry.
                </p>
              </motion.div>
            </HoverAnimation>

            <HoverAnimation scale={1.05} y={-8}>
              <motion.div
                className="text-center bg-gradient-to-br from-white to-accent/5 rounded-xl p-6 border border-accent/20 hover:border-accent/40 transition-all"
                whileHover={{
                  boxShadow: "0 20px 40px rgba(251, 191, 36, 0.15)",
                  rotateY: 5,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="flex justify-center mb-6"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    className="w-16 h-16 bg-accent/30 rounded-lg flex items-center justify-center"
                    whileHover={{ scale: 1.2, backgroundColor: "rgba(251, 191, 36, 0.4)" }}
                  >
                    <Zap className="w-8 h-8 text-accent-foreground" />
                  </motion.div>
                </motion.div>
                <h3 className="font-heading font-bold text-lg text-primary mb-3">
                  Innovation & Excellence
                </h3>
                <p className="text-foreground/70">
                  Using God-given talents and professions creatively to spread the
                  Gospel through various media and methods.
                </p>
              </motion.div>
            </HoverAnimation>
          </StaggerContainer>
        </div>
      </section>

      {/* Committee Structure Section */}
      <section id="about-committee" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollAnimation direction="up" delay={0.2}>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-12">
              Leadership & Departments
            </h2>
          </ScrollAnimation>

          <div className="max-w-4xl mx-auto">
            <ScrollAnimation direction="fade" delay={0.4}>
              <p className="text-foreground/70 text-lg mb-8 leading-relaxed">
                SYPE is led by a dedicated transitional committee with clear roles
                and responsibilities. Each department works together to fulfill
                our mission of equipping young professionals for effective
                evangelism.
              </p>
            </ScrollAnimation>

            <StaggerContainer
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
              staggerDelay={0.15}
              direction="up"
              detectScrollDirection
            >
              <HoverAnimation scale={1.02} y={-5}>
                <div className="bg-white rounded-lg p-6 border border-border hover:border-primary/50 hover:shadow-lg transition-all">
                  <h3 className="font-heading font-bold text-primary mb-2">
                    Communication Department
                  </h3>
                  <p className="text-foreground/70 text-sm">
                    Responsible for public relations, member recruitment, formal announcements, and external communication.
                  </p>
                </div>
              </HoverAnimation>

              <HoverAnimation scale={1.02} y={-5}>
                <div className="bg-white rounded-lg p-6 border border-border hover:border-primary/50 hover:shadow-lg transition-all">
                  <h3 className="font-heading font-bold text-primary mb-2">
                    Public Evangelism Department
                  </h3>
                  <p className="text-foreground/70 text-sm">
                    Focused on organizing and conducting evangelistic activities, outreach programs, and mission camps.
                  </p>
                </div>
              </HoverAnimation>

              <HoverAnimation scale={1.02} y={-5}>
                <div className="bg-white rounded-lg p-6 border border-border hover:border-primary/50 hover:shadow-lg transition-all">
                  <h3 className="font-heading font-bold text-primary mb-2">
                    Fellowship Department
                  </h3>
                  <p className="text-foreground/70 text-sm">
                    Responsible for fostering spiritual growth, building relationships, and creating a supportive community among members.
                  </p>
                </div>
              </HoverAnimation>

              <HoverAnimation scale={1.02} y={-5}>
                <div className="bg-white rounded-lg p-6 border border-border hover:border-primary/50 hover:shadow-lg transition-all">
                  <h3 className="font-heading font-bold text-primary mb-2">
                    Prayers Department
                  </h3>
                  <p className="text-foreground/70 text-sm">
                    In charge of prayer ministry, intercessory prayer, and spiritual support for members and ministry activities.
                  </p>
                </div>
              </HoverAnimation>

              <HoverAnimation scale={1.02} y={-5}>
                <div className="bg-white rounded-lg p-6 border border-border hover:border-primary/50 hover:shadow-lg transition-all">
                  <h3 className="font-heading font-bold text-primary mb-2">
                    Video Preparation
                  </h3>
                  <p className="text-foreground/70 text-sm">
                    Responsible for creating, editing, and producing video content for ministry use, including sermons, teachings, and promotional materials.
                  </p>
                </div>
              </HoverAnimation>

              <HoverAnimation scale={1.02} y={-5}>
                <div className="bg-white rounded-lg p-6 border border-border hover:border-primary/50 hover:shadow-lg transition-all">
                  <h3 className="font-heading font-bold text-primary mb-2">
                    Poster Preparation
                  </h3>
                  <p className="text-foreground/70 text-sm">
                    In charge of designing and creating visual materials including posters, graphics, flyers, and promotional content.
                  </p>
                </div>
              </HoverAnimation>

              <HoverAnimation scale={1.02} y={-5}>
                <div className="bg-white rounded-lg p-6 border border-border hover:border-primary/50 hover:shadow-lg transition-all">
                  <h3 className="font-heading font-bold text-primary mb-2">
                    Publishing Preparation
                  </h3>
                  <p className="text-foreground/70 text-sm">
                    Responsible for preparing, editing, and publishing written content including articles, newsletters, and documentation.
                  </p>
                </div>
              </HoverAnimation>

              <HoverAnimation scale={1.02} y={-5}>
                <div className="bg-white rounded-lg p-6 border border-border hover:border-primary/50 hover:shadow-lg transition-all">
                  <h3 className="font-heading font-bold text-primary mb-2">
                    Health Department
                  </h3>
                  <p className="text-foreground/70 text-sm">
                    Focused on promoting health and wellness through education, health programs, and lifestyle counseling based on Adventist health principles.
                  </p>
                </div>
              </HoverAnimation>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Committee Members Section */}
      {!loading && committeeMembers.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <ScrollAnimation direction="up" delay={0.2}>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary text-center mb-4">
                Committee Members
              </h2>
              <p className="text-foreground/70 text-center max-w-2xl mx-auto mb-12">
                Meet our dedicated leadership team serving SYPE Ministry
              </p>
            </ScrollAnimation>

            {/* Leadership Team */}
            {leadershipTeam.length > 0 && (
              <div className="mb-12">
                <ScrollAnimation direction="fade" delay={0.4}>
                  <h3 className="font-heading font-semibold text-2xl text-primary mb-6 text-center">
                    Leadership Team
                  </h3>
                </ScrollAnimation>
                <StaggerContainer
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto gap-8 mb-8"
                  staggerDelay={0.15}
                  direction="up"
                  detectScrollDirection
                >
                  {leadershipTeam.map((member) => (
                    <HoverAnimation key={member.id} scale={1.02} y={-5}>
                      <Card className="h-full border-2 hover:border-primary/50 hover:shadow-xl transition-all bg-gradient-to-br from-white to-primary/5">
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center text-center">
                            {/* Image */}
                            {member.image ? (
                              <img
                                src={member.image}
                                alt={member.name}
                                className="w-full max-w-[240px] aspect-[3/4] rounded-xl object-cover mb-4 border-4 border-primary/20 shadow-lg"
                              />
                            ) : (
                              <div className="w-full max-w-[240px] aspect-[3/4] rounded-xl bg-primary/10 flex items-center justify-center mb-4 border-4 border-primary/20 shadow-inner">
                                <UserCircle className="w-24 h-24 text-primary/60" />
                              </div>
                            )}
                            {/* Position */}
                            <h4 className="font-heading font-bold text-xl text-primary mb-2">
                              {member.position}
                            </h4>
                            {/* Name */}
                            <p className="font-semibold text-lg text-foreground mb-2">
                              {member.name}
                            </p>
                            {/* Church Location */}
                            <div className="flex items-center gap-2 text-sm text-foreground/70 mb-2">
                              <MapPin className="w-4 h-4" />
                              <span>{member.church.replace(/ASSA UR (NYARUGENGE|GIKONDO)/gi, (match, p1) => `ASA UR ${p1}`)}</span>
                            </div>
                            {/* Phone */}
                            <div className="flex items-center gap-2 text-sm text-foreground/70">
                              <Phone className="w-4 h-4" />
                              <a href={`tel:+250${member.phone.startsWith("0") ? member.phone.substring(1) : member.phone}`} className="hover:text-primary transition-colors">
                                +250{member.phone.startsWith("0") ? member.phone.substring(1) : member.phone}
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </HoverAnimation>
                  ))}
                </StaggerContainer>
              </div>
            )}

            {/* Team & Department Heads */}
            {teamHeads.length > 0 && (
              <div>
                <ScrollAnimation direction="fade" delay={0.4}>
                  <h3 className="font-heading font-semibold text-2xl text-primary mb-6 text-center">
                    Team & Department Heads
                  </h3>
                </ScrollAnimation>
                <StaggerContainer
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto gap-8"
                  staggerDelay={0.15}
                  direction="up"
                  detectScrollDirection
                >
                  {teamHeads.map((member) => (
                    <HoverAnimation key={member.id} scale={1.02} y={-5}>
                      <Card className="h-full border-2 hover:border-primary/50 hover:shadow-xl transition-all bg-gradient-to-br from-white to-primary/5">
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center text-center">
                            {/* Image */}
                            {member.image ? (
                              <img
                                src={member.image}
                                alt={member.name}
                                className="w-full max-w-[240px] aspect-[3/4] rounded-xl object-cover mb-4 border-4 border-primary/20 shadow-lg"
                              />
                            ) : (
                              <div className="w-full max-w-[240px] aspect-[3/4] rounded-xl bg-primary/10 flex items-center justify-center mb-4 border-4 border-primary/20 shadow-inner">
                                <UserCircle className="w-24 h-24 text-primary/60" />
                              </div>
                            )}
                            {/* Position */}
                            <h4 className="font-heading font-bold text-xl text-primary mb-2">
                              {member.position}
                            </h4>
                            {/* Name */}
                            <p className="font-semibold text-lg text-foreground mb-2">
                              {member.name}
                            </p>
                            {/* Church Location */}
                            <div className="flex items-center gap-2 text-sm text-foreground/70 mb-2">
                              <MapPin className="w-4 h-4" />
                              <span>{member.church.replace(/ASSA UR (NYARUGENGE|GIKONDO)/gi, (match, p1) => `ASA UR ${p1}`)}</span>
                            </div>
                            {/* Phone */}
                            <div className="flex items-center gap-2 text-sm text-foreground/70">
                              <Phone className="w-4 h-4" />
                              <a href={`tel:+250${member.phone.startsWith("0") ? member.phone.substring(1) : member.phone}`} className="hover:text-primary transition-colors">
                                +250{member.phone.startsWith("0") ? member.phone.substring(1) : member.phone}
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </HoverAnimation>
                  ))}
                </StaggerContainer>
              </div>
            )}

            {/* Auditors Team */}
            {auditorsTeam.length > 0 && (
              <div className="mt-12">
                <ScrollAnimation direction="fade" delay={0.4}>
                  <h3 className="font-heading font-semibold text-2xl text-primary mb-6 text-center">
                    Auditors Team
                  </h3>
                </ScrollAnimation>
                <StaggerContainer
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto gap-8"
                  staggerDelay={0.15}
                  direction="up"
                  detectScrollDirection
                >
                  {auditorsTeam.map((member) => (
                    <HoverAnimation key={member.id} scale={1.02} y={-5}>
                      <Card className="h-full border-2 hover:border-primary/50 hover:shadow-xl transition-all bg-gradient-to-br from-white to-primary/5">
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center text-center">
                            {/* Image */}
                            {member.image ? (
                              <img
                                src={member.image}
                                alt={member.name}
                                className="w-full max-w-[240px] aspect-[3/4] rounded-xl object-cover mb-4 border-4 border-primary/20 shadow-lg"
                              />
                            ) : (
                              <div className="w-full max-w-[240px] aspect-[3/4] rounded-xl bg-primary/10 flex items-center justify-center mb-4 border-4 border-primary/20 shadow-inner">
                                <UserCircle className="w-24 h-24 text-primary/60" />
                              </div>
                            )}
                            {/* Position */}
                            <h4 className="font-heading font-bold text-xl text-primary mb-2">
                              {member.position}
                            </h4>
                            {/* Name */}
                            <p className="font-semibold text-lg text-foreground mb-2">
                              {member.name}
                            </p>
                            {/* Church Location */}
                            <div className="flex items-center gap-2 text-sm text-foreground/70 mb-2">
                              <MapPin className="w-4 h-4" />
                              <span>{member.church.replace(/ASSA UR (NYARUGENGE|GIKONDO)/gi, (match, p1) => `ASA UR ${p1}`)}</span>
                            </div>
                            {/* Phone */}
                            <div className="flex items-center gap-2 text-sm text-foreground/70">
                              <Phone className="w-4 h-4" />
                              <a href={`tel:+250${member.phone.startsWith("0") ? member.phone.substring(1) : member.phone}`} className="hover:text-primary transition-colors">
                                +250{member.phone.startsWith("0") ? member.phone.substring(1) : member.phone}
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </HoverAnimation>
                  ))}
                </StaggerContainer>
              </div>
            )}

            {/* ASA Representatives */}
            {asaRepresentatives.length > 0 && (
              <div className="mt-12">
                <ScrollAnimation direction="fade" delay={0.4}>
                  <h3 className="font-heading font-semibold text-2xl text-primary mb-6 text-center">
                    ASA Representatives
                  </h3>
                </ScrollAnimation>
                <StaggerContainer
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto gap-8"
                  staggerDelay={0.15}
                  direction="up"
                  detectScrollDirection
                >
                  {asaRepresentatives.map((member) => (
                    <HoverAnimation key={member.id} scale={1.02} y={-5}>
                      <Card className="h-full border-2 hover:border-primary/50 hover:shadow-xl transition-all bg-gradient-to-br from-white to-primary/5">
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center text-center">
                            {/* Image */}
                            {member.image ? (
                              <img
                                src={member.image}
                                alt={member.name}
                                className="w-full max-w-[240px] aspect-[3/4] rounded-xl object-cover mb-4 border-4 border-primary/20 shadow-lg"
                              />
                            ) : (
                              <div className="w-full max-w-[240px] aspect-[3/4] rounded-xl bg-primary/10 flex items-center justify-center mb-4 border-4 border-primary/20 shadow-inner">
                                <UserCircle className="w-24 h-24 text-primary/60" />
                              </div>
                            )}
                            {/* Position */}
                            <h4 className="font-heading font-bold text-xl text-primary mb-2">
                              {member.position}
                            </h4>
                            {/* Name */}
                            <p className="font-semibold text-lg text-foreground mb-2">
                              {member.name}
                            </p>
                            {/* Church Location */}
                            <div className="flex items-center gap-2 text-sm text-foreground/70 mb-2">
                              <MapPin className="w-4 h-4" />
                              <span>{member.church.replace(/ASSA UR (NYARUGENGE|GIKONDO)/gi, (match, p1) => `ASA UR ${p1}`)}</span>
                            </div>
                            {/* Phone */}
                            <div className="flex items-center gap-2 text-sm text-foreground/70">
                              <Phone className="w-4 h-4" />
                              <a href={`tel:+250${member.phone.startsWith("0") ? member.phone.substring(1) : member.phone}`} className="hover:text-primary transition-colors">
                                +250{member.phone.startsWith("0") ? member.phone.substring(1) : member.phone}
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </HoverAnimation>
                  ))}
                </StaggerContainer>
              </div>
            )}

            {/* Board of Counsellors */}
            {boardCounsellors.length > 0 && (
              <div className="mt-12">
                <ScrollAnimation direction="fade" delay={0.4}>
                  <h3 className="font-heading font-semibold text-2xl text-primary mb-6 text-center">
                    Board of Counsellors
                  </h3>
                </ScrollAnimation>
                <StaggerContainer
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto gap-8"
                  staggerDelay={0.15}
                  direction="up"
                  detectScrollDirection
                >
                  {boardCounsellors.map((member) => (
                    <HoverAnimation key={member.id} scale={1.02} y={-5}>
                      <Card className="h-full border-2 hover:border-primary/50 hover:shadow-xl transition-all bg-gradient-to-br from-white to-primary/5">
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center text-center">
                            {/* Image */}
                            {member.image ? (
                              <img
                                src={member.image}
                                alt={member.name}
                                className="w-full max-w-[240px] aspect-[3/4] rounded-xl object-cover mb-4 border-4 border-primary/20 shadow-lg"
                              />
                            ) : (
                              <div className="w-full max-w-[240px] aspect-[3/4] rounded-xl bg-primary/10 flex items-center justify-center mb-4 border-4 border-primary/20 shadow-inner">
                                <UserCircle className="w-24 h-24 text-primary/60" />
                              </div>
                            )}
                            {/* Position */}
                            <h4 className="font-heading font-bold text-xl text-primary mb-2">
                              {member.position}
                            </h4>
                            {/* Name */}
                            <p className="font-semibold text-lg text-foreground mb-2">
                              {member.name}
                            </p>
                            {/* Church Location */}
                            <div className="flex items-center gap-2 text-sm text-foreground/70 mb-2">
                              <MapPin className="w-4 h-4" />
                              <span>{member.church.replace(/ASSA UR (NYARUGENGE|GIKONDO)/gi, (match, p1) => `ASA UR ${p1}`)}</span>
                            </div>
                            {/* Phone */}
                            <div className="flex items-center gap-2 text-sm text-foreground/70">
                              <Phone className="w-4 h-4" />
                              <a href={`tel:+250${member.phone.startsWith("0") ? member.phone.substring(1) : member.phone}`} className="hover:text-primary transition-colors">
                                +250{member.phone.startsWith("0") ? member.phone.substring(1) : member.phone}
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </HoverAnimation>
                  ))}
                </StaggerContainer>
              </div>
            )}
          </div>
        </section>
      )}

      {loading && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 text-center">
            <p className="text-foreground/70">Loading committee members...</p>
          </div>
        </section>
      )}

      {/* FAQs Section */}
      <section id="about-faqs" className="py-16 md:py-24 bg-white scroll-mt-20">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary text-center mb-12">
            Frequently Asked Questions
          </h2>
          <p className="text-foreground/70 text-lg text-center max-w-2xl mx-auto mb-12">
            Find answers to common questions about SYPE Ministry, membership, activities, and more.
          </p>
          <div className="flex justify-center mb-12">
            <motion.a
              href="https://chat.whatsapp.com/DIKintfrZjbARzYMQ1SQbN"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-green-500 px-6 py-3 text-sm md:text-base font-semibold text-white shadow-lg hover:bg-green-600 transition-colors"
              animate={{ scale: [1, 1.06, 1], boxShadow: ["0 0 0 rgba(0,0,0,0)", "0 0 24px rgba(34,197,94,0.6)", "0 0 0 rgba(0,0,0,0)"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              Click here to join training WhatsApp group
            </motion.a>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {aboutFaqs.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="text-xl">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem
                        key={faqIndex}
                        value={`item-${categoryIndex}-${faqIndex}`}
                      >
                        <AccordionTrigger className="text-left font-semibold">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-foreground/80 leading-relaxed">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}

            <div className="text-center pt-6">
              <p className="text-foreground/70 mb-4">
                Still have questions? We're here to help!
              </p>
              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Link to="/faqs#faqs">View All FAQs</Link>
              </Button>
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-base font-semibold rounded-lg"
            >
              <Link to="/membership">Join SYPE Today</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white text-black bg-white hover:bg-black hover:text-white px-8 py-6 text-base font-semibold rounded-lg"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
