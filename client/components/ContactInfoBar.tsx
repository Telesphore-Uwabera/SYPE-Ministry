import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Clock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function ContactInfoBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const contactInfo = [
    {
      icon: Phone,
      text: "+250 780 430 990",
      link: "tel:+250780430990",
      label: "Call Us",
    },
    {
      icon: Phone,
      text: "+250 785 073 847",
      link: "tel:+250785073847",
      label: "Call Us",
    },
    {
      icon: Mail,
      text: "sypeministry@gmail.com",
      link: "mailto:sypeministry@gmail.com",
      label: "Email Us",
    },
    {
      icon: MapPin,
      text: "Kigali, Rwanda",
      link: "/contact",
      label: "Location",
    },
    {
      icon: Clock,
      text: "Sun - Fri: 8:00 AM - 6:00 PM",
      link: null,
      label: "Hours",
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`
            fixed top-0 left-0 right-0 z-[60] 
            bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 
            text-white border-b border-primary/20
            ${isScrolled ? "shadow-lg" : "shadow-sm"}
            transition-all duration-300
          `}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-10 md:h-12">
              {/* Desktop: Show all contact info */}
              <div className="hidden lg:flex items-center gap-6 flex-1">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  const content = (
                    <div className="flex items-center gap-2 group">
                      <IconComponent 
                        size={14} 
                        className="text-primary group-hover:text-primary/80 transition-colors flex-shrink-0" 
                      />
                      <span className="text-xs md:text-sm text-white/90 group-hover:text-white transition-colors whitespace-nowrap">
                        {info.text}
                      </span>
                    </div>
                  );

                  if (info.link) {
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {info.link.startsWith("http") || info.link.startsWith("/") ? (
                          <Link
                            to={info.link}
                            className="flex items-center gap-2 group"
                            aria-label={info.label}
                          >
                            <IconComponent 
                              size={14} 
                              className="text-primary group-hover:text-primary/80 transition-colors flex-shrink-0" 
                            />
                            <span className="text-xs md:text-sm text-white/90 group-hover:text-white transition-colors whitespace-nowrap">
                              {info.text}
                            </span>
                          </Link>
                        ) : (
                          <a
                            href={info.link}
                            className="flex items-center gap-2 group"
                            aria-label={info.label}
                          >
                            <IconComponent 
                              size={14} 
                              className="text-primary group-hover:text-primary/80 transition-colors flex-shrink-0" 
                            />
                            <span className="text-xs md:text-sm text-white/90 group-hover:text-white transition-colors whitespace-nowrap">
                              {info.text}
                            </span>
                          </a>
                        )}
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <IconComponent size={14} className="text-primary flex-shrink-0" />
                      <span className="text-xs md:text-sm text-white/90 whitespace-nowrap">
                        {info.text}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Medium screens (tablets): Show phones, email, and location */}
              <div className="hidden md:flex lg:hidden items-center gap-3 flex-1">
                <motion.a
                  href="tel:+250780430990"
                  className="flex items-center gap-1.5 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Phone size={12} className="text-primary group-hover:text-primary/80 transition-colors flex-shrink-0" />
                  <span className="text-[10px] text-white/90 group-hover:text-white transition-colors whitespace-nowrap">
                    +250 780 430 990
                  </span>
                </motion.a>
                <motion.a
                  href="tel:+250785073847"
                  className="flex items-center gap-1.5 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Phone size={12} className="text-primary group-hover:text-primary/80 transition-colors flex-shrink-0" />
                  <span className="text-[10px] text-white/90 group-hover:text-white transition-colors whitespace-nowrap">
                    +250 785 073 847
                  </span>
                </motion.a>
                <motion.a
                  href="mailto:sypeministry@gmail.com"
                  className="flex items-center gap-1.5 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Mail size={12} className="text-primary group-hover:text-primary/80 transition-colors flex-shrink-0" />
                  <span className="text-[10px] text-white/90 group-hover:text-white transition-colors truncate max-w-[120px]">
                    sypeministry@gmail.com
                  </span>
                </motion.a>
                <motion.div
                  className="flex items-center gap-1.5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <MapPin size={12} className="text-primary flex-shrink-0" />
                  <span className="text-[10px] text-white/90 whitespace-nowrap">
                    Kigali
                  </span>
                </motion.div>
              </div>

              {/* Small screens (mobile): Show phones and email with full text */}
              <div className="flex md:hidden items-center gap-2 flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <motion.a
                  href="tel:+250780430990"
                  className="flex items-center gap-1 group flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Phone size={11} className="text-primary group-hover:text-primary/80 transition-colors" />
                  <span className="text-[9px] text-white/90 group-hover:text-white transition-colors whitespace-nowrap">
                    0780 430 990
                  </span>
                </motion.a>
                <motion.a
                  href="tel:+250785073847"
                  className="flex items-center gap-1 group flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Phone size={11} className="text-primary group-hover:text-primary/80 transition-colors" />
                  <span className="text-[9px] text-white/90 group-hover:text-white transition-colors whitespace-nowrap">
                    0785 073 847
                  </span>
                </motion.a>
                <motion.a
                  href="mailto:sypeministry@gmail.com"
                  className="flex items-center gap-1 group flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Mail size={11} className="text-primary group-hover:text-primary/80 transition-colors" />
                  <span className="text-[9px] text-white/90 group-hover:text-white transition-colors whitespace-nowrap">
                    sypeministry@gmail.com
                  </span>
                </motion.a>
                <motion.div
                  className="flex items-center gap-1 group flex-shrink-0"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    to="/contact"
                    className="flex items-center gap-1 group"
                    aria-label="Location"
                  >
                    <MapPin size={11} className="text-primary group-hover:text-primary/80 transition-colors" />
                    <span className="text-[9px] text-white/90 group-hover:text-white transition-colors whitespace-nowrap">
                      Kigali, Rwanda
                    </span>
                  </Link>
                </motion.div>
              </div>

              {/* Close Button */}
              <motion.button
                onClick={() => setIsVisible(false)}
                className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/70 hover:text-white ml-4"
                aria-label="Close contact bar"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={14} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
