"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

const defaultFAQs: FAQItem[] = [
  {
    question: "How long does shipping take?",
    answer: "We offer fast shipping within 2-3 business days. Express delivery options are also available at checkout for even faster service.",
  },
  {
    question: "Is this product suitable for sensitive skin?",
    answer: "Our products are formulated with gentle, skin-loving ingredients. However, we always recommend doing a patch test first if you have sensitive skin.",
  },
  {
    question: "What's your return policy?",
    answer: "We offer a hassle-free 30-day return policy. If you're not completely satisfied, you can return the product for a full refund.",
  },
  {
    question: "How do I use this product?",
    answer: "Each product comes with detailed instructions. You can also find usage tips and tutorials in the product description tab above.",
  },
  {
    question: "Are your products cruelty-free?",
    answer: "Yes! All our products are 100% cruelty-free and never tested on animals. We're committed to ethical beauty practices.",
  },
];

interface ProductFAQProps {
  faqs?: FAQItem[];
  className?: string;
}

function FAQAccordionItem({ item, isOpen, onToggle, index }: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={cn(
        "border-b border-brand-rose/20 last:border-b-0",
        "transition-colors duration-300",
        isOpen && "bg-brand-blush/10"
      )}
    >
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between py-4 px-4 sm:px-6 text-left",
          "hover:bg-brand-blush/5 transition-colors duration-200"
        )}
      >
        <span className="font-sans text-sm sm:text-base font-medium text-brand-ink pr-4">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
            "bg-brand-blush/30 text-brand-ink",
            isOpen && "bg-brand-ink text-white"
          )}
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-4 sm:px-6 pb-4 text-sm text-brand-slate leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ProductFAQ({ faqs = defaultFAQs, className }: ProductFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={cn("py-12 sm:py-16 md:py-20 bg-brand-offWhite", className)}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <HelpCircle className="w-5 h-5 text-brand-rose" />
            <span className="text-xs uppercase tracking-[0.2em] text-brand-rose font-medium">
              Got Questions?
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-brand-ink">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-brand-slate max-w-md mx-auto">
            Everything you need to know about our products and services.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-brand-rose/10 overflow-hidden"
        >
          {faqs.map((faq, index) => (
            <FAQAccordionItem
              key={index}
              item={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </motion.div>

        {/* Contact CTA */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-6 sm:mt-8 text-sm text-brand-slate"
        >
          Still have questions?{" "}
          <a
            href="/contact"
            className="text-brand-rose hover:text-brand-ink underline transition-colors"
          >
            Contact our support team
          </a>
        </motion.p>
      </div>
    </section>
  );
}
