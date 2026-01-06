import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PagePlaceholderProps {
  title: string;
  description: string;
}

export default function PagePlaceholder({
  title,
  description,
}: PagePlaceholderProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/50 to-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-accent/20 mb-6">
            <span className="text-2xl">📄</span>
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-4">
            {title}
          </h1>
          <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
            {description}
          </p>
          <div className="bg-white rounded-lg border border-border p-8 mb-8">
            <p className="text-foreground/60 mb-4">
              This page is being prepared. Let us know if you'd like to create
              the content for this section!
            </p>
          </div>
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link to="/">
              <span>Back to Home</span>
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
