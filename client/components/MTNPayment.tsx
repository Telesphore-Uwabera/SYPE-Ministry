import { useState } from "react";
import { Copy, Check, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface MTNPaymentProps {
  variant?: "bar" | "floating" | "footer";
  className?: string;
}

export default function MTNPayment({ variant = "bar", className = "" }: MTNPaymentProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const paymentCode = "*182*1*1*0782789883#";

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentCode);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "MTN payment code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === "floating") {
    return (
      <motion.div
        className={`fixed right-4 z-50 ${className}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        <motion.div
          className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white rounded-lg shadow-2xl p-4 max-w-[200px] border-2 border-yellow-300"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <Smartphone className="w-6 h-6" />
            <p className="text-xs font-semibold text-center">Support via MTN</p>
            <div className="bg-white/20 rounded px-2 py-1 w-full overflow-x-auto">
              <p className="text-sm font-mono font-bold text-center whitespace-nowrap">
                {paymentCode}
              </p>
            </div>
            <p className="text-xs text-center opacity-90">
              Registered to: Niyonkuru Simeon
            </p>
            <button
              onClick={handleCopy}
              className="text-xs bg-white/20 hover:bg-white/30 rounded px-3 py-1 transition-colors flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={`border-2 border-primary/30 rounded-lg p-4 bg-primary/5 ${className}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-primary">Support via MTN Mobile Money</p>
              <p className="text-xs text-white">Dial the code below to donate</p>
              <p className="text-xs text-white/80 mt-1">
                Registered to: <span className="font-medium">Niyonkuru Simeon</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white dark:bg-slate-800 rounded px-3 py-2 border border-primary/20 overflow-x-auto">
              <p className="text-base font-mono font-bold text-primary whitespace-nowrap">
                {paymentCode}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="p-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
              aria-label="Copy payment code"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default bar variant
  return (
    // On small screens, keep the yellow bar ABOVE the contact bar
    <div className={`fixed top-0 md:top-12 left-0 right-0 z-[70] bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-2 h-10 md:h-10 lg:h-12">
          <div className="flex items-center gap-2 md:gap-3 flex-1 w-full md:w-auto">
            <Smartphone className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
            <div className="flex items-center gap-2 md:gap-3 flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <span className="text-xs md:text-sm font-semibold whitespace-nowrap">
                Support via MTN:
              </span>
              <div className="bg-white/20 rounded px-2 py-1 flex-1 md:flex-initial overflow-x-auto">
                <p className="text-xs md:text-sm font-mono font-bold text-center md:text-left whitespace-nowrap">
                  {paymentCode}
                </p>
              </div>
              <span className="hidden md:inline text-xs opacity-90 whitespace-nowrap">
                (Registered to: Niyonkuru Simeon)
              </span>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="ml-2 md:ml-4 p-1.5 md:p-2 bg-white/20 hover:bg-white/30 rounded transition-colors flex items-center gap-1 md:gap-2 flex-shrink-0"
            aria-label="Copy payment code"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden md:inline text-xs">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden md:inline text-xs">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
