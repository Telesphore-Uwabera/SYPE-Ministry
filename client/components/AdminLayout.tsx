import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { LogOut, Home, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "./SEO";

interface AdminLayoutProps {
  children: ReactNode;
  user?: {
    email: string;
    user_metadata?: {
      full_name?: string;
    };
  } | null;
  onLogout: () => void;
}

export default function AdminLayout({ children, user, onLogout }: AdminLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SEO
        title="Admin Dashboard - SYPE Ministry"
        description="SYPE Ministry Admin Dashboard - Manage website content and operations"
      />
      
      {/* Admin Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg">SYPE Ministry</h1>
              <p className="text-xs text-foreground/60">Admin Dashboard</p>
            </div>
          </Link>

          {/* Right Side - User Info and Actions */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:block text-sm text-foreground/70">
                <p className="font-semibold">{user.email}</p>
                {user.user_metadata?.full_name && (
                  <p className="text-xs">{user.user_metadata.full_name}</p>
                )}
              </div>
            )}
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">View Site</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
