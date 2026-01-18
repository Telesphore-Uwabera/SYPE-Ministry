import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const STORAGE_KEY = "sype_cookie_consent"; // accepted | rejected

function getConsent(): "accepted" | "rejected" | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "accepted" || v === "rejected") return v;
    return null;
  } catch {
    return null;
  }
}

function setConsent(v: "accepted" | "rejected") {
  try {
    localStorage.setItem(STORAGE_KEY, v);
  } catch {
    // ignore
  }
}

export function resetCookieConsent() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const consent = useMemo(() => (typeof window !== "undefined" ? getConsent() : null), []);

  useEffect(() => {
    // Show only if no prior choice
    if (!consent) setOpen(true);
  }, [consent]);

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="mx-auto max-w-4xl">
        <Card className="border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 shadow-lg">
          <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="flex-1 text-sm text-foreground/80">
              <p className="font-semibold text-foreground mb-1">Cookies & privacy</p>
              <p>
                We use essential cookies/technologies to run this website and remember your preferences. You can read more in our{" "}
                <Link to="/cookies" className="text-primary hover:underline">
                  Cookies Policy
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <Button
                variant="outline"
                onClick={() => {
                  setConsent("rejected");
                  setOpen(false);
                }}
              >
                Reject non-essential
              </Button>
              <Button
                onClick={() => {
                  setConsent("accepted");
                  setOpen(false);
                }}
              >
                Accept all
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

