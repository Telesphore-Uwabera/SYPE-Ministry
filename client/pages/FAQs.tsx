import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

export default function FAQs() {
  const faqs = [
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
        },
        {
          q: "What kind of media content does SYPE produce?",
          a: "SYPE produces evangelism posters, videos (sermons, testimonies, evangelism methods), written content, and digital materials for social media sharing and outreach."
        }
      ]
    },
    {
      category: "Donations & Support",
      questions: [
        {
          q: "How can I support SYPE Ministry?",
          a: "You can support SYPE Ministry through donations, volunteering your time and talents, participating in evangelism projects, or sharing our content and mission with others."
        },
        {
          q: "How are donations used?",
          a: "All donations are used to support evangelism projects and ministry activities, including media production, mission camps, outreach programs, and resource development."
        },
        {
          q: "Is my donation tax-deductible?",
          a: "Please contact us directly for information about tax deductions and receipts for donations, as this may vary by location and local regulations."
        },
        {
          q: "Can I specify how my donation is used?",
          a: "While we appreciate your support, donations are generally used where they are most needed for evangelism activities. You can contact us to discuss specific project support."
        }
      ]
    },
    {
      category: "Resources & Content",
      questions: [
        {
          q: "Where can I find SYPE Ministry videos?",
          a: "You can find our videos on our YouTube channel at https://www.youtube.com/@sypeministry5276. We also share videos and content on our website and social media platforms."
        },
        {
          q: "Can I use SYPE Ministry content for my own evangelism?",
          a: "SYPE Ministry content is created for evangelism purposes. Please contact us for permission to use our materials, and we encourage sharing our content to spread the Gospel."
        },
        {
          q: "How can I access the library resources?",
          a: "Library resources are available to SYPE members. Contact us or visit our library page for more information about accessing evangelism materials and resources."
        },
        {
          q: "Do you provide evangelism training materials?",
          a: "Yes, SYPE provides structured training in evangelism methods and biblical principles. Members have access to training materials and participate in training programs."
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
        },
        {
          q: "How often do you update your website?",
          a: "We regularly update our website with news, events, and new content. Follow us on social media and subscribe to our updates to stay informed."
        },
        {
          q: "Can I subscribe to newsletters or updates?",
          a: "Yes, you can stay updated by following our social media channels, subscribing to our YouTube channel, or contacting us to be added to our communication list."
        }
      ]
    }
  ];

  return (
    <Layout>
      <div id="faqs" className="min-h-screen bg-gradient-to-br from-muted/50 to-background py-12 md:py-20 scroll-mt-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-primary mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Find answers to common questions about SYPE Ministry, membership, activities, and more.
            </p>
          </motion.div>

          {/* FAQs Content */}
          <motion.div
            className="max-w-4xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {faqs.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="text-2xl">{category.category}</CardTitle>
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

            {/* Still Have Questions */}
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-2xl">Still Have Questions?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  If you couldn't find the answer you're looking for, we're here to help! Contact us and we'll get back to you as soon as possible.
                </p>
                <p className="font-semibold">
                  Email: sypeministry@gmail.com<br />
                  Phone: +250 780 430 990 / +250 785 073 847<br />
                  Location: Kigali, Rwanda
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

