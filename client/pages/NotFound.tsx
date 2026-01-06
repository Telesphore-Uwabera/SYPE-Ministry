import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-br from-muted/50 to-background py-20">
        <div className="text-center px-4">
          <h1 className="font-heading font-bold text-6xl md:text-8xl text-primary mb-4">
            404
          </h1>
          <p className="text-2xl font-semibold text-foreground mb-4">
            Page Not Found
          </p>
          <p className="text-lg text-foreground/70 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist. It might have been moved
            or removed.
          </p>
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
    </Layout>
  );
};

export default NotFound;
