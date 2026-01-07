import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { History, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import ScrollAnimation, { StaggerContainer, HoverAnimation } from "@/components/ScrollAnimation";

export default function About() {
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

      {/* History Section */}
      <section className="py-16 md:py-24 bg-white relative">
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
      <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
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
      <section className="py-16 md:py-24 bg-white">
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

      {/* FAQs Section */}
      <section id="faqs" className="py-16 md:py-24 bg-white scroll-mt-20">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary text-center mb-12">
            Frequently Asked Questions
          </h2>
          <p className="text-foreground/70 text-lg text-center max-w-2xl mx-auto mb-12">
            Find answers to common questions about SYPE Ministry, membership, activities, and more.
          </p>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                category: "General Information",
                questions: [
                  {
                    q: "What is SYPE Ministry?",
                    a: "SYPE (Seventh-day Adventist Young Professionals in Evangelism) is a ministry uniting alumni and students from Adventist Associations in public universities in Kigali and beyond, dedicated to structured, consistent, and impactful evangelism."
                  },
                  {
                    q: "When was SYPE Ministry established?",
                    a: "SYPE Ministry was officially established on September 14, 2019, with official activities launching in April 2020."
                  },
                  {
                    q: "What is the mission of SYPE Ministry?",
                    a: "Our mission is to equip young SDA professionals for active evangelism through their talents, professions, and service, enabling them to serve through evangelical projects and outreach."
                  },
                  {
                    q: "Where is SYPE Ministry located?",
                    a: "SYPE Ministry is based in Kigali, Rwanda, and serves young professionals from Adventist Student Associations in public universities in Kigali and beyond."
                  }
                ]
              },
              {
                category: "Membership",
                questions: [
                  {
                    q: "Who can become a member of SYPE Ministry?",
                    a: "Seventh-day Adventist member from Adventist Student and Alumni Associations (ASSA Kigali) Plus any other location."
                  },
                  {
                    q: "How do I join SYPE Ministry?",
                    a: "Membership is invitation-based. You can be invited by an existing SYPE member, or you can contact us directly through our contact page to express your interest in joining."
                  },
                  {
                    q: "What are the benefits of membership?",
                    a: "Members receive evangelism training, mentorship opportunities, project participation, leadership development, community support, and access to exclusive evangelism materials and resources."
                  },
                  {
                    q: "Is there a membership fee?",
                    a: "SYPE Ministry does not charge membership fees. However, members are encouraged to support evangelism projects through voluntary contributions and donations."
                  }
                ]
              },
              {
                category: "Activities & Programs",
                questions: [
                  {
                    q: "What activities does SYPE Ministry organize?",
                    a: "SYPE organizes various activities including weekly prayer and devotion programs, evangelism projects, mission camps, media content creation (videos, posters, written content), and digital outreach initiatives."
                  },
                  {
                    q: "When are the weekly devotion programs?",
                    a: "Our weekly prayer and devotion program takes place every Sunday from 6:00 PM to 7:00 PM via WhatsApp. The program focuses on Jesus' methods and Ellen G. White's teachings on evangelism."
                  },
                  {
                    q: "How can I participate in evangelism projects?",
                    a: "Members are invited to participate in various evangelical projects. Those interested can volunteer for projects that match their talents and professions. Contact us or check with project coordinators for current opportunities."
                  }
                ]
              },
              {
                category: "Contact & Communication",
                questions: [
                  {
                    q: "How can I contact SYPE Ministry?",
                    a: "You can contact us via email at sypeministry@gmail.com, phone at +250 780 430 990 or +250 785 073 847, or through our contact page on the website."
                  },
                  {
                    q: "Do you have a WhatsApp group?",
                    a: "Yes, SYPE has a WhatsApp community group for members. The group is used for communication, coordination, and sharing approved evangelism materials."
                  }
                ]
              }
            ].map((category, categoryIndex) => (
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
