import Layout from "@/components/Layout";
import {
  Users,
  Megaphone,
  Zap,
  CheckCircle2,
  FileText,
  BookOpen,
} from "lucide-react";

export default function Departments() {
  const departments = [
    {
      icon: Users,
      title: "Student Coordination",
      subtitle: "Mobilizing Student Members",
      description:
        "Responsible for mobilizing students and coordinating student-led activities and engagement programs.",
      responsibilities: [
        "Recruit and engage student members",
        "Organize student-focused events and activities",
        "Facilitate participation in evangelical projects",
        "Build community among student professionals",
      ],
    },
    {
      icon: Users,
      title: "Alumni Coordination",
      subtitle: "Mobilizing Alumni Professionals",
      description:
        "Responsible for mobilizing alumni professionals and coordinating their participation in ministry activities.",
      responsibilities: [
        "Connect with SYPE alumni across professions",
        "Coordinate professional expertise for projects",
        "Organize mentorship and networking opportunities",
        "Facilitate resource contribution from professionals",
      ],
    },
    {
      icon: FileText,
      title: "Documentation & Records",
      subtitle: "Keeping Ministry Records",
      description:
        "In charge of documenting all meetings, member registrations, project archives, and institutional memory.",
      responsibilities: [
        "Record and archive all meetings",
        "Maintain member registration database",
        "Document project outcomes and learnings",
        "Create and maintain institutional records",
      ],
    },
    {
      icon: Megaphone,
      title: "Communications",
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
      title: "Technical & Digital Assets",
      subtitle: "Digital Presence & Assets",
      description:
        "In charge of SYPE's digital presence including YouTube channels, emails, and all digital communication platforms.",
      responsibilities: [
        "Manage YouTube channel and video content",
        "Oversee email communication systems",
        "Maintain website and digital platforms",
        "Handle technical aspects of content distribution",
      ],
    },
    {
      icon: CheckCircle2,
      title: "Project Management",
      subtitle: "Implementation & Assessment",
      description:
        "Responsible for follow-up on project implementation, monitoring progress, and assessing results.",
      responsibilities: [
        "Monitor project implementation status",
        "Track progress against project timelines",
        "Assess project outcomes and impact",
        "Provide feedback for continuous improvement",
      ],
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-secondary to-primary py-16 md:py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
            Our Departments
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Organized structure with specialized departments working together to
            advance our evangelical mission
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-6">
            Our Organization
          </h2>
          <p className="text-foreground/70 text-lg leading-relaxed mb-6">
            SYPE Ministry operates through a dedicated committee structure with
            six specialized departments. Each department has clear roles and
            responsibilities to ensure our ministry runs efficiently and
            effectively.
          </p>
          <p className="text-foreground/70 text-lg leading-relaxed">
            Our organizational approach follows Ellen G. White's principle:
            "Everything must be done according to a well-matured plan, and with
            system. God has entrusted His sacred work to men, and He asks that
            they shall do it carefully."
          </p>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {departments.map((dept, idx) => {
              const IconComponent = dept.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-8 border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xl text-primary">
                        {dept.title}
                      </h3>
                      <p className="text-primary text-sm font-semibold">
                        {dept.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-foreground/80 mb-5 leading-relaxed">
                    {dept.description}
                  </p>

                  <div>
                    <p className="font-heading font-semibold text-primary mb-3">
                      Key Responsibilities:
                    </p>
                    <ul className="space-y-2">
                      {dept.responsibilities.map((resp, respIdx) => (
                        <li
                          key={respIdx}
                          className="flex gap-2 text-foreground/70 text-sm"
                        >
                          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
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
              <h3 className="font-heading font-bold text-lg text-primary mb-2">
                🤝 Cross-Departmental Collaboration
              </h3>
              <p className="text-foreground/70">
                Our departments don't work in isolation. They collaborate
                closely to ensure projects succeed, communication is clear, and
                members are engaged and supported.
              </p>
            </div>

            <div className="bg-primary/10 rounded-lg p-6 border-l-4 border-primary">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">
                📊 Unified Vision
              </h3>
              <p className="text-foreground/70">
                Every department contributes to our shared mission: equipping
                young SDA professionals to spread the Gospel through their
                talents and professions.
              </p>
            </div>

            <div className="bg-secondary/10 rounded-lg p-6 border-l-4 border-secondary">
              <h3 className="font-heading font-bold text-lg text-primary mb-2">
                ✨ Specialized Excellence
              </h3>
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
            <a
              href="#contact"
              className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              Get Involved <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
