"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { pageTransition, fadeInUp, staggerContainer } from "@/shared/theme/animations";
import { Footer } from "@/features/footer/components/Footer";
import { PageHero } from "@/features/hero/components/PageHero";
import { Mail, Phone, MapPin, Clock, Send, ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert("Thank you for your message! We'll respond within 24 hours.");
    setIsSubmitting(false);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "hello@diora.com", href: "mailto:hello@diora.com" },
    { icon: Phone, label: "Phone", value: "+20 123 456 7890", href: "tel:+201234567890" },
    { icon: MapPin, label: "Address", value: "Cairo, Egypt", href: "#" },
    { icon: Clock, label: "Hours", value: "Sun - Thu, 9AM - 6PM", href: "#" },
  ];

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col w-full bg-brand-offWhite min-h-screen"
    >
      <PageHero
        title="Get in Touch"
        description="We'd love to hear from you. Whether you have a question about our products, need assistance, or just want to say hello."
      />

      {/* Premium Contact Section */}
      <section className="relative z-0 bg-brand-offWhite py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid md:grid-cols-2 gap-12 md:gap-20"
          >
            {/* Left: Contact Info */}
            <motion.div variants={fadeInUp} className="space-y-8">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-brand-ink mb-4">
                  Let&apos;s Connect
                </h2>
                <p className="text-brand-slate leading-relaxed">
                  Our dedicated team is here to assist you with any inquiries. 
                  We typically respond within 24 hours during business days.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-brand-rose/10 hover:border-brand-rose/30 hover:shadow-lg hover:shadow-brand-rose/5 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-brand-blush/50 flex items-center justify-center group-hover:bg-brand-rose/20 transition-colors">
                      <item.icon size={20} className="text-brand-rose" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-brand-slate mb-0.5">
                        {item.label}
                      </p>
                      <p className="font-medium text-brand-ink">
                        {item.value}
                      </p>
                    </div>
                    <ArrowRight 
                      size={16} 
                      className="ml-auto text-brand-mist opacity-0 group-hover:opacity-100 group-hover:text-brand-rose transition-all" 
                    />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Right: Premium Form */}
            <motion.div variants={fadeInUp}>
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 md:p-10 border border-brand-rose/10 shadow-xl shadow-brand-rose/5">
                <h3 className="font-serif text-2xl text-brand-ink mb-8">
                  Send a Message
                </h3>

                <div className="space-y-6">
                  {/* Name Field */}
                  <div className="relative">
                    <label 
                      className={cn(
                        "absolute left-4 transition-all duration-200 pointer-events-none",
                        focusedField === "name" || formData.name
                          ? "-top-2 text-xs text-brand-rose bg-white px-1"
                          : "top-4 text-sm text-brand-slate"
                      )}
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-4 bg-brand-offWhite/50 border border-brand-petal/20 rounded-xl text-sm focus:border-brand-rose focus:bg-white outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <label 
                      className={cn(
                        "absolute left-4 transition-all duration-200 pointer-events-none",
                        focusedField === "email" || formData.email
                          ? "-top-2 text-xs text-brand-rose bg-white px-1"
                          : "top-4 text-sm text-brand-slate"
                      )}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-4 bg-brand-offWhite/50 border border-brand-petal/20 rounded-xl text-sm focus:border-brand-rose focus:bg-white outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Subject Field */}
                  <div className="relative">
                    <label 
                      className={cn(
                        "absolute left-4 transition-all duration-200 pointer-events-none",
                        focusedField === "subject" || formData.subject
                          ? "-top-2 text-xs text-brand-rose bg-white px-1"
                          : "top-4 text-sm text-brand-slate"
                      )}
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      onFocus={() => setFocusedField("subject")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-4 bg-brand-offWhite/50 border border-brand-petal/20 rounded-xl text-sm focus:border-brand-rose focus:bg-white outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Message Field */}
                  <div className="relative">
                    <label 
                      className={cn(
                        "absolute left-4 transition-all duration-200 pointer-events-none",
                        focusedField === "message" || formData.message
                          ? "-top-2 text-xs text-brand-rose bg-white px-1 z-10"
                          : "top-4 text-sm text-brand-slate"
                      )}
                    >
                      Your Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      rows={5}
                      className="w-full px-4 py-4 bg-brand-offWhite/50 border border-brand-petal/20 rounded-xl text-sm focus:border-brand-rose focus:bg-white outline-none transition-all resize-none"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "w-full flex items-center justify-center gap-3 py-4 rounded-xl font-medium transition-all duration-300",
                      isSubmitting
                        ? "bg-brand-mist text-white cursor-not-allowed"
                        : "bg-brand-ink text-white hover:bg-brand-rose"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </motion.div>
  );
}
