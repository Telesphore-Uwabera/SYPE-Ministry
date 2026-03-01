import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Heart, Globe, DollarSign, Target, Users, Zap, MessageCircle } from "lucide-react";
import DonationForm from "@/components/DonationForm";
import { useState } from "react";
import ScrollAnimation from "@/components/ScrollAnimation";

export default function Donations() {
  const [showForm, setShowForm] = useState(false);

  const donationOptions = [
    {
      title: "One-Time Donation",
      description: "Make a single gift to support immediate ministry needs",
      icon: DollarSign,
    },
    {
      title: "Monthly Support",
      description:
        "Become a sustaining partner with recurring monthly contributions",
      icon: Heart,
    },
    {
      title: "Project-Based Giving",
      description:
        "Support specific evangelical projects that align with your passion",
      icon: Target,
    },
  ];

  const impacts = [
    {
      amount: "2000 RWF",
      description: "Produces a quality poster for social media sharing",
    },
    {
      amount: "2000 RWF",
      description:
        "Helps produce a short video for YouTube and Facebook distribution",
    },
    {
      amount: "40000 RWF",
      description:
        "Supports a complete evangelistic materials production cycle",
    },
    {
      amount: "200000+ RWF",
      description:
        "Funds a major evangelical project reaching thousands with Gospel",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-secondary to-primary py-16 md:py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
            Support the Mission
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Your financial partnership enables SYPE Ministry to produce
            impactful evangelical content and reach thousands with the Gospel
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-6">
            Why Give?
          </h2>

          <div className="space-y-6">
            <p className="text-foreground/80 text-lg leading-relaxed">
              Evangelism requires resources. Every documentary, poster, video,
              and article produced by SYPE Ministry represents an investment in
              spreading the Gospel. Your contribution directly enables us to:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <Globe className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading font-bold text-primary mb-2">
                    Reach More People
                  </h3>
                  <p className="text-foreground/70">
                    Produce quality content for digital and traditional
                    platforms
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading font-bold text-primary mb-2">
                    Sustain Operations
                  </h3>
                  <p className="text-foreground/70">
                    Fund ongoing administrative and project coordination costs
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Users className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading font-bold text-primary mb-2">
                    Equip Members
                  </h3>
                  <p className="text-foreground/70">
                    Support training programs and member development initiatives
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Heart className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading font-bold text-primary mb-2">
                    Expand Impact
                  </h3>
                  <p className="text-foreground/70">
                    Scale up projects to reach communities beyond Kigali
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Options Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary text-center mb-12">
            Ways to Give
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {donationOptions.map((option, idx) => {
              const IconComponent = option.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-8 border border-border text-center hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-primary mb-2">
                    {option.title}
                  </h3>
                  <p className="text-foreground/70">{option.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Your Impact Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary text-center mb-12">
            Your Impact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {impacts.map((impact, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg p-6 border border-accent/30"
              >
                <p className="text-2xl font-heading font-bold text-primary mb-2">
                  {impact.amount}
                </p>
                <p className="text-foreground/70">{impact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-lg p-8 border-2 border-primary">
            <blockquote className="mb-6">
              <p className="font-serif italic text-xl text-primary mb-4">
                "Though we never imagined managing large-scale projects, today
                we handle initiatives worth over 200,000 RWF—and we are
                preparing for projects worth millions."
              </p>
              <footer className="text-foreground/70">
                — Elder Ndacyayishima Justin, President
              </footer>
            </blockquote>
            <p className="text-foreground/70 leading-relaxed">
              This remarkable growth is made possible by faithful partners who
              believe in SYPE's mission. As we prepare for larger projects and
              expanded reach, your support becomes even more crucial in helping
              us achieve our vision of equipping young professionals for
              sustainable, organized, and innovative evangelism.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="donate" className="py-16 md:py-24 bg-primary text-primary-foreground scroll-mt-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollAnimation direction="fade" delay={0.2}>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
              Be a Partner in Evangelism
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
              Your financial contribution is a partnership in spreading the Gospel
              and preparing people for Christ's soon return.
            </p>
            {!showForm ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-base font-semibold rounded-lg"
                >
                  Make a Donation
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/20 text-white bg-white/10 hover:bg-white/20 px-8 py-6 text-base font-semibold rounded-lg transition-all"
                >
                  <Link to="/contact">Contact for Details</Link>
                </Button>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto">
                <DonationForm onSuccess={() => setShowForm(false)} />
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="mt-4 border-white/20 text-white bg-white/10 hover:bg-white/20"
                >
                  Cancel
                </Button>
              </div>
            )}
          </ScrollAnimation>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h3 className="font-heading font-bold text-2xl text-primary mb-6">
            Questions About Giving?
          </h3>
          <p className="text-foreground/70 text-lg mb-6">
            Contact SYPE Ministry for more information about how you can support
            our evangelical initiatives
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-6"
            >
              <a href="mailto:sypeministry@gmail.com" className="inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Us
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-6"
            >
              <a href="tel:+250780430990" className="inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Us
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* WhatsApp Training Group Section */}
      <section className="py-16 md:py-24 bg-muted/30">
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
