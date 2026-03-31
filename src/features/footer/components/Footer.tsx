"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/shared/theme/animations";
import { Camera, Send, Mail, MapPin, Phone, ShieldCheck, Truck, RotateCcw, Check, Loader2, CreditCard } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const FOOTER_LINKS = {
  shop: [
    { label: "Best Sellers", href: "/#bestsellers" },
    { label: "Skin Care", href: "/category/skin-care" },
    { label: "Hair Care", href: "/category/hair-care" },
    { label: "New Arrivals", href: "/#bestsellers" },
  ],
  company: [
    { label: "Our Story", href: "/#about" },
    { label: "Sustainability", href: "#" },
    { label: "Press", href: "#" },
    { label: "Careers", href: "#" },
  ],
  support: [
    { label: "Shipping & Returns", href: "#" },
    { label: "FAQs", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ],
};

const SOCIALS = [
  { label: "Instagram", icon: Camera, href: "https://instagram.com/diora" },
  { label: "TikTok", icon: Send, href: "https://tiktok.com/@diora" },
  { label: "Pinterest", icon: Mail, href: "https://pinterest.com/diora" },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "Secure Payment", sub: "256-bit SSL encryption" },
  { icon: Truck, label: "Fast Shipping", sub: "2-3 business days" },
  { icon: RotateCcw, label: "Easy Returns", sub: "30-day returns" },
];

const PAYMENT_ICONS = [
  { name: "Visa", svg: "M18.1 12.5h-3.8l-1.6-7.5h3.8l1.6 7.5zM12 5c-1.5 0-2.8.8-3.5 2l-3.2 7.5H8l1-2.5h4.8l.8 2.5h3.2L13 5h-1zM8.5 10.5l1-2.5 1 2.5H8.5zM2 5l3.5 7.5H8L5.2 5H2z" },
  { name: "Mastercard", svg: "M15 12c0-2.2-1.8-4-4-4s-4 1.8-4 4 1.8 4 4 4 4-1.8 4-4z" },
  { name: "Amex", svg: "M4 5h16v10H4V5zm2 2v6h12V7H6zm2 2h2v2H8V9zm4 0h4v2h-4V9z" },
  { name: "PayPal", svg: "M6 5h12c.6 0 1 .4 1 1v8c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1V6c0-.6.4-1 1-1zm2 3v4h2V8H8zm4 0v4h2V8h-2z" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || newsletterStatus === "loading") return;

    setNewsletterStatus("loading");
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setNewsletterStatus("success");
    setEmail("");
    
    // Reset after 3 seconds
    setTimeout(() => setNewsletterStatus("idle"), 3000);
  };
  return (
    <footer className="w-full bg-brand-ink text-brand-offWhite">
      {/* Newsletter Section */}
      <div className="section-padding py-16 md:py-20 border-b border-brand-offWhite/10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <motion.div variants={fadeInUp} className="text-center md:text-left">
            <h3 className="font-serif text-2xl md:text-3xl tracking-tight mb-2">
              Join The DIORA Circle
            </h3>
            <p className="text-sm text-brand-offWhite/60 font-sans max-w-md">
              Be the first to discover new arrivals, exclusive offers, and luxury beauty insights.
            </p>
          </motion.div>
          <motion.form
            variants={fadeInUp}
            className="flex w-full max-w-md relative"
            onSubmit={handleNewsletterSubmit}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              disabled={newsletterStatus === "loading" || newsletterStatus === "success"}
              className={cn(
                "flex-1 px-5 py-3 bg-brand-offWhite/5 border border-brand-offWhite/20 rounded-l-full text-sm font-sans text-brand-offWhite placeholder:text-brand-offWhite/40 focus:outline-none focus:border-brand-rose/60 transition-colors",
                newsletterStatus === "success" && "border-emerald-500/50",
                newsletterStatus === "error" && "border-red-500/50"
              )}
            />
            <button
              type="submit"
              disabled={newsletterStatus === "loading" || newsletterStatus === "success"}
              className={cn(
                "px-6 py-3 font-sans text-xs uppercase tracking-widest font-medium rounded-r-full transition-colors duration-300 flex items-center gap-2",
                newsletterStatus === "success" 
                  ? "bg-emerald-500 text-white" 
                  : "bg-brand-rose text-white hover:bg-brand-deepRose"
              )}
            >
              <AnimatePresence mode="wait">
                {newsletterStatus === "loading" ? (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Loader2 size={16} className="animate-spin" />
                  </motion.div>
                ) : newsletterStatus === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Check size={16} />
                    <span>Subscribed!</span>
                  </motion.div>
                ) : (
                  <motion.span
                    key="subscribe"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Subscribe
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.form>
        </motion.div>
      </div>

      {/* Trust Badges */}
      <div className="section-padding py-8 border-b border-brand-offWhite/10 bg-brand-ink/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRUST_BADGES.map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 justify-center md:justify-start"
              >
                <div className="w-12 h-12 rounded-full bg-brand-offWhite/10 flex items-center justify-center">
                  <badge.icon size={24} className="text-brand-rose" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-sans text-sm font-medium text-brand-offWhite">{badge.label}</p>
                  <p className="font-sans text-xs text-brand-offWhite/60">{badge.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="section-padding py-16 md:py-20">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8"
        >
          {/* Brand Column */}
          <motion.div variants={fadeInUp} className="col-span-2 md:col-span-1">
            <Link href="/">
              <h2 className="font-serif text-3xl tracking-widest uppercase font-semibold mb-6">
                Diora
              </h2>
            </Link>
            <p className="text-sm text-brand-offWhite/60 font-sans leading-relaxed mb-6 max-w-xs">
              Premium personal care crafted with the finest ingredients. Purity in every drop.
            </p>
            <div className="flex items-center gap-4">
              {SOCIALS.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-brand-offWhite/20 flex items-center justify-center text-brand-offWhite/60 hover:text-brand-rose hover:border-brand-rose transition-all duration-300"
                >
                  <Icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Shop Links */}
          <motion.div variants={fadeInUp}>
            <h4 className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-brand-offWhite/80 mb-6">
              Shop
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-sans text-brand-offWhite/60 hover:text-brand-rose transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={fadeInUp}>
            <h4 className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-brand-offWhite/80 mb-6">
              Company
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-sans text-brand-offWhite/60 hover:text-brand-rose transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div variants={fadeInUp}>
            <h4 className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-brand-offWhite/80 mb-6">
              Support
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-sans text-brand-offWhite/60 hover:text-brand-rose transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* Payment & Copyright */}
      <div className="section-padding py-6 border-t border-brand-offWhite/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-brand-offWhite/40 uppercase tracking-widest font-sans">
            © {new Date().getFullYear()} DIORA. All Rights Reserved.
          </p>
          
          {/* Payment Icons */}
          <div className="flex items-center gap-3">
            {PAYMENT_ICONS.map((payment) => (
              <div
                key={payment.name}
                className="w-10 h-6 bg-brand-offWhite/10 rounded flex items-center justify-center"
                title={payment.name}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-4 text-brand-offWhite/60"
                >
                  <path d={payment.svg} />
                </svg>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <Link href="#" className="text-[10px] text-brand-offWhite/40 uppercase tracking-widest font-sans hover:text-brand-rose transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-[10px] text-brand-offWhite/40 uppercase tracking-widest font-sans hover:text-brand-rose transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
