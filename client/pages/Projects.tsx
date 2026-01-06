import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Play, FileText, Image, Video } from "lucide-react";

export default function Projects() {
  const projects = [
    {
      category: "Documentary",
      name: "Final Global Crisis",
      topic: "Prophecy",
      description:
        "A series of 8-10 short documentaries (15-20 minutes) explaining prophecy from books of Daniel and Revelation, with focus on Sabbath and Sunday worship.",
      distribution: "Upload on YouTube, Facebook, and share on WhatsApp groups",
      type: "ongoing",
      year: "2020",
    },
    {
      category: "Documentary",
      name: "USA in Prophecy",
      topic: "Prophecy",
      description:
        "Documentary series exploring the role of the USA in biblical prophecy and eschatology.",
      distribution: "Multiple digital platforms",
      type: "ongoing",
      year: "2020",
    },
    {
      category: "Posters",
      name: "Bible Highlights from Genesis to Revelation",
      topic: "Evangelism",
      description:
        "Sharing highlights from bible verses and quotes covering the full biblical narrative from creation to redemption.",
      distribution:
        "Share on WhatsApp statuses and groups, Facebook, and elsewhere",
      type: "ongoing",
      year: "2020",
    },
    {
      category: "Posters",
      name: "All About Sabbath",
      topic: "Gospel & Prophecy",
      description:
        "Happy Sabbath wishes and Bible truth about Sabbath with prophecy information.",
      distribution: "Share on WhatsApp statuses, Facebook, and other channels",
      type: "ongoing",
      year: "2020",
    },
    {
      category: "Posters",
      name: "Councils on Nutrition and Foods",
      topic: "Health",
      description:
        "Sharing highlights articles from the book 'Councils on Nutrition and Foods' for health education and temperance promotion.",
      distribution: "Social media platforms and church groups",
      type: "ongoing",
      year: "2020",
    },
    {
      category: "Articles",
      name: "Center of End Time",
      topic: "Prophecy",
      description:
        "Comprehensive tract describing the essential topics of Bible prophecy focusing on Sabbath and Sunday worship.",
      distribution: "Social media and door-to-door distribution",
      type: "ongoing",
      year: "2020",
    },
    {
      category: "Articles",
      name: "Healthy in its Natural State",
      topic: "Health",
      description:
        "Educational tract showing that health is the right hand of Jesus Christ through the 3rd angel's message.",
      distribution: "Print and digital sharing",
      type: "ongoing",
      year: "2020",
    },
    {
      category: "Articles",
      name: "The Path of Salvation in Sanctuary",
      topic: "Gospel",
      description:
        "Tract describing sanctuary images as the steps to the Gospel message.",
      distribution: "Various media and door-to-door outreach",
      type: "ongoing",
      year: "2020",
    },
  ];

  const getIcon = (category: string) => {
    switch (category) {
      case "Documentary":
        return <Video className="w-5 h-5" />;
      case "Posters":
        return <Image className="w-5 h-5" />;
      case "Articles":
        return <FileText className="w-5 h-5" />;
      default:
        return <Play className="w-5 h-5" />;
    }
  };

  const getBadgeColor = (topic: string) => {
    switch (topic) {
      case "Prophecy":
        return "bg-primary/20 text-primary";
      case "Gospel & Prophecy":
        return "bg-secondary/20 text-secondary";
      case "Health":
        return "bg-accent/30 text-accent-foreground";
      default:
        return "bg-muted text-foreground";
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-secondary to-primary py-16 md:py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
            Evangelical Projects
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Discover our diverse evangelical initiatives producing impactful
            content to spread the Gospel
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-2">
              Ongoing Projects
            </h2>
            <p className="text-foreground/70">
              Active evangelical initiatives producing Bible-based content and
              outreach materials
            </p>
          </div>

          <div className="space-y-6">
            {projects.map((project, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg border border-border hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                      {getIcon(project.category)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-lg text-primary mb-1">
                        {project.name}
                      </h3>
                      <p className="text-foreground/70 text-sm">
                        {project.category}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`${getBadgeColor(
                      project.topic,
                    )} whitespace-nowrap`}
                  >
                    {project.topic}
                  </Badge>
                </div>

                <p className="text-foreground/80 mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm">
                    <span className="font-semibold text-foreground">
                      Distribution Strategy:
                    </span>
                    <span className="text-foreground/70 ml-2">
                      {project.distribution}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Submission Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-8">
            Project Submission Process
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-semibold text-primary">Submit Proposal</p>
                <p className="text-foreground/70 text-sm">
                  Any SYPE member can submit a project proposal
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-semibold text-primary">Committee Review</p>
                <p className="text-foreground/70 text-sm">
                  Committee approves and discusses the proposed project
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-semibold text-primary">Member Enrollment</p>
                <p className="text-foreground/70 text-sm">
                  Members volunteer for projects that match their interests
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-semibold text-primary">Production</p>
                <p className="text-foreground/70 text-sm">
                  Selected team produces the project with excellence
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                5
              </div>
              <div>
                <p className="font-semibold text-primary">Review & Feedback</p>
                <p className="text-foreground/70 text-sm">
                  Committee reviews completed project (6 hours) and members
                  provide feedback (12 hours)
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                6
              </div>
              <div>
                <p className="font-semibold text-primary">Distribution</p>
                <p className="text-foreground/70 text-sm">
                  Share across WhatsApp groups, Facebook, YouTube, websites, and
                  all available channels
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-6">
            Making an Impact
          </h2>
          <p className="text-foreground/70 text-lg leading-relaxed mb-8">
            Through diverse projects in documentaries, posters, and articles,
            SYPE Ministry is reaching thousands with the Gospel message. Each
            project is designed with careful planning, professional execution,
            and strategic distribution to maximize impact across digital and
            traditional platforms.
          </p>
          <p className="text-foreground/70 text-lg leading-relaxed">
            Every SYPE member can contribute their unique talents and
            professions to make these projects successful and bring the message
            of Christ to more people.
          </p>
        </div>
      </section>
    </Layout>
  );
}
