import Layout from "@/components/Layout";
import { Mail, Phone, Youtube, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Contact() {
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
      content: "+250 780 430 990",
      link: "tel:+250780430990",
      description: "Call or WhatsApp us",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+250 785 073 847",
      link: "tel:+250785073847",
      description: "Alternative contact number",
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
      <div className="min-h-screen bg-gradient-to-br from-muted/50 to-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-primary mb-4">
              Get In Touch
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              Have questions or want to connect with SYPE Ministry? Reach out to us via email, phone, or through our social media channels.
            </p>
          </motion.div>

          {/* Contact Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              const CardComponent = info.link ? (
                <a
                  href={info.link}
                  target={info.link.startsWith("http") ? "_blank" : undefined}
                  rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="block h-full"
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{info.title}</CardTitle>
                      </div>
                      <CardDescription>{info.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground font-medium">{info.content}</p>
                    </CardContent>
                  </Card>
                </a>
              ) : (
                <Card className="h-full border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{info.title}</CardTitle>
                    </div>
                    <CardDescription>{info.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground font-medium">{info.content}</p>
                  </CardContent>
                </Card>
              );

              return (
                <motion.div key={index} variants={itemVariants}>
                  {CardComponent}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Additional Info Section */}
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white border-2">
              <CardHeader>
                <CardTitle className="text-2xl">We'd Love to Hear From You</CardTitle>
                <CardDescription className="text-base">
                  Whether you're interested in joining the ministry, have questions about our programs, or want to support our evangelism efforts, we're here to help.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Response Time</h3>
                    <p className="text-foreground/70">
                      We typically respond to emails and messages within 24-48 hours. For urgent matters, please call us directly.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Office Hours</h3>
                    <p className="text-foreground/70">
                      Our team is available Monday through Friday, 9:00 AM - 5:00 PM (Rwanda Time). You can also reach us through WhatsApp at any time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
