import { useState } from "react";
import Layout from "@/components/Layout";
import { Mail, Phone, Youtube, MapPin, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import ScrollAnimation, { StaggerContainer, HoverAnimation } from "@/components/ScrollAnimation";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "sypeministry@gmail.com",
      link: "mailto:sypeministry@gmail.com",
      description: "Send us an email anytime",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+250 780 430 990 / +250 785 073 847",
      link: "tel:+250780430990",
      description: "Call or WhatsApp us",
    },
    {
      icon: Youtube,
      title: "YouTube",
      content: "@sypeministry5276",
      link: "https://www.youtube.com/@sypeministry5276",
      description: "Subscribe to our channel",
    },
    {
      icon: MapPin,
      title: "Location",
      content: "Kigali, Rwanda",
      link: null,
      description: "Based in Rwanda",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Training",
      content: "Join our training group",
      link: "https://chat.whatsapp.com/DIKintfrZjbARzYMQ1SQbN",
      description: "Connect with members on WhatsApp",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <Layout>
      <div id="contact" className="min-h-screen bg-gradient-to-br from-muted/50 to-background py-12 md:py-20 scroll-mt-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <ScrollAnimation direction="up" delay={0.2}>
            <div className="text-center mb-12">
              <h1 className="font-heading font-bold text-4xl md:text-5xl text-primary mb-4">
                Get In Touch
              </h1>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                Have questions or want to connect with SYPE Ministry? Reach out to us via email, phone, or through our social media channels.
              </p>
            </div>
          </ScrollAnimation>

          {/* Contact Cards */}
          <StaggerContainer
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12 items-stretch"
            staggerDelay={0.15}
            direction="up"
          >
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              const CardComponent = info.link ? (
                <HoverAnimation key={index} scale={1.02} y={-5} className="h-full">
                  <a
                    href={info.link}
                    target={info.link.startsWith("http") ? "_blank" : undefined}
                    rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="block h-full"
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary bg-gradient-to-br from-white to-primary/5 flex flex-col">
                      <CardHeader className="flex-shrink-0">
                        <div className="flex items-center gap-2 mb-2">
                          <motion.div
                            className="p-2 bg-primary/10 rounded-lg flex-shrink-0"
                            whileHover={{ rotate: 360, scale: 1.2 }}
                            transition={{ duration: 0.6 }}
                          >
                            <Icon className="w-5 h-5 text-primary" />
                          </motion.div>
                          <CardTitle className="text-base lg:text-sm leading-tight">{info.title}</CardTitle>
                        </div>
                        <CardDescription className="text-xs">{info.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex items-center min-w-0">
                        <p className={`text-foreground font-medium text-sm ${info.title === "Phone" ? "text-xs leading-tight whitespace-nowrap overflow-x-auto w-full text-center" : ""}`}>
                          {info.content}
                        </p>
                      </CardContent>
                    </Card>
                  </a>
                </HoverAnimation>
              ) : (
                <HoverAnimation key={index} scale={1.02} y={-5} className="h-full">
                  <Card className="h-full border-2 bg-gradient-to-br from-white to-primary/5 flex flex-col">
                    <CardHeader className="flex-shrink-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-base lg:text-sm leading-tight">{info.title}</CardTitle>
                      </div>
                      <CardDescription className="text-xs">{info.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex items-center min-w-0">
                      <p className={`text-foreground font-medium text-sm ${info.title === "Phone" ? "text-xs leading-tight whitespace-nowrap overflow-x-auto w-full text-center" : ""}`}>
                        {info.content}
                      </p>
                    </CardContent>
                  </Card>
                </HoverAnimation>
              );

              return CardComponent;
            })}
          </StaggerContainer>

          {/* Contact Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Contact Form */}
            <ScrollAnimation direction="right" delay={0.4}>
              <Card className="border-2 bg-gradient-to-br from-white to-primary/5">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Send className="w-6 h-6 text-primary" />
                    Send Us a Message
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What is this regarding?"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help you..."
                        rows={6}
                        className="mt-1"
                      />
                    </div>
                    {submitStatus === "success" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg text-sm"
                      >
                        Thank you! Your message has been sent. We'll get back to you soon.
                      </motion.div>
                    )}
                    {submitStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg text-sm"
                      >
                        Something went wrong. Please try again or contact us directly.
                      </motion.div>
                    )}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full"
                          />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Send Message
                        </span>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </ScrollAnimation>

            {/* Additional Info Section */}
            <ScrollAnimation direction="left" delay={0.4}>
              <Card className="h-full border-2 bg-gradient-to-br from-white to-primary/5">
                <CardHeader>
                  <CardTitle className="text-2xl">We'd Love to Hear From You</CardTitle>
                  <CardDescription className="text-base">
                    Whether you're interested in joining the ministry, have questions about our programs, or want to support our evangelism efforts, we're here to help.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Response Time
                      </h3>
                      <p className="text-foreground/70">
                        We typically respond to emails and messages within 24-48 hours. For urgent matters, please call us directly.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                        <Phone className="w-5 h-5" />
                        Office Hours
                      </h3>
                      <p className="text-foreground/70">
                        Our team is available Monday through Friday, 9:00 AM - 5:00 PM (Rwanda Time). You can also reach us through WhatsApp at any time.
                      </p>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <h3 className="font-semibold text-primary mb-3">Quick Actions</h3>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <Button asChild variant="outline" size="sm">
                            <a href="/membership">Join Ministry</a>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <a href="/donations">Support Us</a>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <a href="/faqs">View FAQs</a>
                          </Button>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <Button
                            asChild
                            variant="default"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2"
                          >
                            <a href="mailto:sypeministry@gmail.com" className="inline-flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              Email Us
                            </a>
                          </Button>
                          <Button
                            asChild
                            variant="default"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2"
                          >
                            <a href="tel:+250780430990" className="inline-flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              Call Us
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </Layout>
  );
}
