"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Package } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = () => {
    setIsProcessing(true);
    // Simulate processing - in production this would redirect to Stripe
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-brand-ink/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-full max-w-md bg-brand-offWhite rounded-luxury shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative px-6 py-8 text-center bg-gradient-to-b from-brand-blush/30 to-transparent">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-brand-ink/40 hover:text-brand-ink transition-colors"
              >
                <X size={20} />
              </button>

              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-rose/10 flex items-center justify-center">
                {isProcessing ? (
                  <div className="w-6 h-6 border-2 border-brand-rose/30 border-t-brand-rose rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-6 h-6 text-brand-rose" />
                )}
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl text-brand-ink tracking-tight mb-2">
                {isProcessing ? "Processing..." : "Coming Soon"}
              </h2>

              {/* Description */}
              <p className="font-sans text-sm text-brand-slate leading-relaxed max-w-xs mx-auto">
                {isProcessing
                  ? "Preparing your luxury order..."
                  : "Our secure checkout experience is being perfected. Sign up to be notified when it launches."}
              </p>
            </div>

            {/* Content */}
            {!isProcessing && (
              <div className="px-6 pb-6">
                {/* Features */}
                <div className="flex flex-col gap-3 mb-6">
                  {[
                    "Secure payment via Stripe",
                    "Free luxury gift wrapping",
                    "Express shipping available",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 text-sm text-brand-ink/70"
                    >
                      <Package className="w-4 h-4 text-brand-rose" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Email Input */}
                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Enter your email for updates"
                    className="w-full px-4 py-3 bg-white border border-brand-rose/20 rounded-luxury text-sm font-sans text-brand-ink placeholder:text-brand-mist focus:outline-none focus:border-brand-rose/50 transition-colors"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCheckout}
                    className="flex-1 py-3 bg-brand-ink text-brand-offWhite font-sans text-sm font-medium uppercase tracking-widest rounded-full hover:bg-brand-ink/90 transition-colors"
                  >
                    Notify Me
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 border border-brand-ink/20 text-brand-ink font-sans text-sm font-medium uppercase tracking-widest rounded-full hover:bg-brand-ink hover:text-brand-offWhite transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Processing State */}
            {isProcessing && (
              <div className="px-6 pb-8 text-center">
                <p className="font-sans text-xs text-brand-mist uppercase tracking-widest">
                  Please wait...
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
