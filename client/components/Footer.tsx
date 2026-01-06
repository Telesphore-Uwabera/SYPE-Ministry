import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Youtube, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/Sype logo.png"
                alt="SYPE Ministry Logo"
                className="h-8 w-auto object-contain"
              />
              <h3 className="font-heading font-bold text-lg">
                SYPE Ministry
              </h3>
            </div>
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
              <li>
                <Link
                  to="/faqs"
                  className="hover:underline opacity-90 hover:opacity-100"
                >
                  FAQs
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
                  href="mailto:sypeministry@gmail.com"
                  className="hover:underline opacity-90 hover:opacity-100"
                >
                  sypeministry@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <a
                  href="tel:+250780430990"
                  className="hover:underline opacity-90 hover:opacity-100"
                >
                  +250 780 430 990
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <a
                  href="tel:+250785073847"
                  className="hover:underline opacity-90 hover:opacity-100"
                >
                  +250 785 073 847
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span className="opacity-90">Kigali, Rwanda</span>
              </li>
            </ul>
          </div>

          {/* Social Links & Ask SYPE */}
          <div>
            <h4 className="font-heading font-semibold text-base mb-4">
              Find Us At
            </h4>
            {/* Vertical on large screens, horizontal on medium/small */}
            <div className="flex flex-row lg:flex-col gap-3 mb-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg transition-colors w-fit"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg transition-colors w-fit"
                aria-label="X (Twitter)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@sypeministry5276"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg transition-colors w-fit"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg transition-colors w-fit"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg transition-colors w-fit"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg transition-colors text-sm font-semibold"
            >
              <span>Ask SYPE</span>
            </Link>
          </div>
        </div>

        {/* Scripture Quote & Copyright */}
        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm opacity-90">
          <p className="font-serif italic mb-4">
            "And this gospel shall be preached in all the world..."
            <br />
            <span className="not-italic font-semibold">— Matthew 24:14</span>
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Link
              to="/terms"
              className="hover:underline opacity-90 hover:opacity-100 text-sm"
            >
              Terms and Conditions
            </Link>
            <span className="opacity-50">|</span>
            <Link
              to="/privacy"
              className="hover:underline opacity-90 hover:opacity-100 text-sm"
            >
              Privacy Policy
            </Link>
            <span className="opacity-50">|</span>
            <Link
              to="/cookies"
              className="hover:underline opacity-90 hover:opacity-100 text-sm"
            >
              Cookies Policy
            </Link>
          </div>
          <p className="mb-2">
            Feel free to{" "}
            <a
              href="https://uwaberatelesphore.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline opacity-90 hover:opacity-100 transition-opacity"
            >
              contact the developer
            </a>
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
