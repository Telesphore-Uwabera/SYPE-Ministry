import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">
              SYPE Ministry
            </h3>
            <p className="text-sm leading-relaxed opacity-90">
              Equipping young SDA professionals for evangelism through talents,
              professions, and service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-base mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="hover:underline opacity-90 hover:opacity-100"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/membership"
                  className="hover:underline opacity-90 hover:opacity-100"
                >
                  Membership
                </Link>
              </li>
              <li>
                <Link
                  to="/donations"
                  className="hover:underline opacity-90 hover:opacity-100"
                >
                  Support Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:underline opacity-90 hover:opacity-100"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading font-semibold text-base mb-4">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/library"
                  className="hover:underline opacity-90 hover:opacity-100"
                >
                  Library
                </Link>
              </li>
              <li>
                <Link
                  to="/devotions"
                  className="hover:underline opacity-90 hover:opacity-100"
                >
                  Devotions
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="hover:underline opacity-90 hover:opacity-100"
                >
                  News
                </Link>
              </li>
              <li>
                <Link
                  to="/videos"
                  className="hover:underline opacity-90 hover:opacity-100"
                >
                  Videos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-base mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <a
                  href="mailto:sype@example.com"
                  className="hover:underline opacity-90 hover:opacity-100"
                >
                  sype@example.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <a
                  href="tel:+250700000000"
                  className="hover:underline opacity-90 hover:opacity-100"
                >
                  +250 700 000 000
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span className="opacity-90">Kigali, Rwanda</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-primary-foreground/20 pt-8 mb-8">
          <h4 className="font-heading font-semibold text-base mb-4">
            Follow Us
          </h4>
          <div className="flex gap-4">
            <a
              href="#"
              className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="#"
              className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg transition-colors"
              aria-label="YouTube"
            >
              <Youtube size={20} />
            </a>
          </div>
        </div>

        {/* Scripture Quote & Copyright */}
        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm opacity-90">
          <p className="font-serif italic mb-4">
            "And this gospel shall be preached in all the world..."
            <br />
            <span className="not-italic font-semibold">— Matthew 24:14</span>
          </p>
          <p>
            © 2024 SYPE Ministry. All rights reserved. | Seventh-day Adventist
            Young Professionals in Evangelism
          </p>
        </div>
      </div>
    </footer>
  );
}
