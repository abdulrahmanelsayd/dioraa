"use client";

import { useState } from "react";
import { Product } from "@/shared/types";
import { cn } from "@/shared/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ProductTabsProps {
  product: Product;
}

const TABS = ["Description", "Ingredients", "Shipping"] as const;
type TabId = (typeof TABS)[number];

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("Description");

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="flex border-b border-brand-petal">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "relative px-6 py-4 font-sans text-sm uppercase tracking-widest transition-colors duration-300",
              activeTab === tab
                ? "text-brand-ink font-semibold"
                : "text-brand-mist hover:text-brand-slate"
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-rose"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="py-8"
        >
          {activeTab === "Description" && (
            <div className="max-w-2xl">
              <p className="font-sans text-brand-slate text-sm leading-relaxed">
                {product.description || "No description available."}
              </p>
            </div>
          )}

          {activeTab === "Ingredients" && (
            <div className="max-w-2xl">
              {product.ingredients && product.ingredients.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.ingredients.map((ingredient) => (
                    <li
                      key={ingredient}
                      className="flex items-center gap-3 font-sans text-sm text-brand-slate"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-rose flex-shrink-0" />
                      {ingredient}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="font-sans text-brand-mist text-sm">
                  Ingredient list coming soon.
                </p>
              )}
            </div>
          )}

          {activeTab === "Shipping" && (
            <div className="max-w-2xl space-y-4">
              <div>
                <h4 className="font-sans font-semibold text-sm text-brand-ink uppercase tracking-wider mb-2">
                  Standard Shipping
                </h4>
                <p className="font-sans text-sm text-brand-slate">
                  Free on orders over $75. Delivery within 5–7 business days.
                </p>
              </div>
              <div>
                <h4 className="font-sans font-semibold text-sm text-brand-ink uppercase tracking-wider mb-2">
                  Express Shipping
                </h4>
                <p className="font-sans text-sm text-brand-slate">
                  $12.00 flat rate. Delivery within 2–3 business days.
                </p>
              </div>
              <div>
                <h4 className="font-sans font-semibold text-sm text-brand-ink uppercase tracking-wider mb-2">
                  Returns
                </h4>
                <p className="font-sans text-sm text-brand-slate">
                  We offer a 30-day hassle-free return policy on all unopened
                  products. Contact our support team to initiate a return.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
