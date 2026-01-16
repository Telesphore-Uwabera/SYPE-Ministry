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

  const grouped = useMemo(() => {
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
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.question.localeCompare(b.question)),
      }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [items]);

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
            {loading ? (
              <div className="text-center py-12 text-foreground/70">Loading FAQs...</div>
            ) : grouped.length === 0 ? (
              <div className="text-center py-12 text-foreground/70">
                No FAQs available yet.
              </div>
            ) : (
              grouped.map((category, categoryIndex) => (
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
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-foreground/80 leading-relaxed">
                          {faq.answer}
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

