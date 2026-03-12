import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { buildApiUrl } from "@/lib/apiConfig";

type ApiFAQ = {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
};

type FaqSection = {
  category: string;
  questions: { q: string; a: React.ReactNode }[];
};

const fallbackFaqs: FaqSection[] = [
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

export default function FAQs() {
  const [items, setItems] = useState<ApiFAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const apiUrl = buildApiUrl("/api/faqs");
        const res = await fetch(apiUrl, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to fetch FAQs:", e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const grouped = useMemo<FaqSection[]>(() => {
    const map = new Map<string, ApiFAQ[]>();
    for (const f of items) {
      const key = (f.category || "General").trim() || "General";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(f);
    }
    return Array.from(map.entries())
      .map(([category, questions]) => ({
        category,
        questions: questions
          .slice()
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.question.localeCompare(b.question))
          .map((q) => ({ q: q.question, a: q.answer })),
      }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [items]);

  const sections = grouped.length > 0 ? grouped : fallbackFaqs;

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
            <motion.a
              href="https://chat.whatsapp.com/DIKintfrZjbARzYMQ1SQbN"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-green-500 px-6 py-3 text-sm md:text-base font-semibold text-white shadow-lg hover:bg-green-600 transition-colors"
              animate={{ scale: [1, 1.06, 1], boxShadow: ["0 0 0 rgba(0,0,0,0)", "0 0 24px rgba(34,197,94,0.6)", "0 0 0 rgba(0,0,0,0)"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              Click here to join training WhatsApp group
            </motion.a>
          </motion.div>

          {/* FAQs Content */}
          <motion.div
            className="max-w-4xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {loading ? (
              <div className="text-center py-12 text-foreground/70">Loading FAQs...</div>
            ) : sections.length === 0 ? (
              <div className="text-center py-12 text-foreground/70">
                No FAQs available yet.
              </div>
            ) : (
              sections.map((category, categoryIndex) => (
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
            ))
            )}

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

