"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useState } from "react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Breadcrumb[];
  className?: string;
  showHome?: boolean;
  variant?: "default" | "glass" | "minimal";
  onClick?: () => void;
}

// Glass morphism pill for Apple Vision Pro style
function GlassPill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative px-4 py-2 rounded-full",
        "bg-white/70 backdrop-blur-xl",
        "border border-white/40",
        "shadow-[0_8px_32px_rgba(212,165,165,0.15)]",
        "hover:shadow-[0_12px_40px_rgba(212,165,165,0.25)]",
        "transition-all duration-500",
        className
      )}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/50 via-transparent to-brand-rose/5 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// Individual breadcrumb item with luxury hover effects
function BreadcrumbItem({ 
  item, 
  index, 
  isLast,
  onClick
}: { 
  item: Breadcrumb; 
  index: number; 
  isLast: boolean;
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center"
    >
      {/* Separator */}
      {index > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.05 }}
          className="mx-2"
        >
          <ChevronRight 
            size={14} 
            className="text-brand-rose/40" 
            strokeWidth={1.5}
          />
        </motion.div>
      )}

      {/* Breadcrumb Content */}
      {item.href && !isLast ? (
        <motion.div
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link 
            href={item.href}
            onClick={() => {
              onClick?.();
            }}
            className={cn(
              "relative px-3 py-1.5 rounded-full text-xs font-sans tracking-wide transition-all duration-300",
              "text-brand-mist hover:text-brand-ink",
              isHovered && "bg-brand-blush/30"
            )}
          >
            <span className="capitalize">{item.label}</span>
            
            {/* Animated underline */}
            <motion.span
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-brand-rose"
              initial={{ width: 0 }}
              animate={{ width: isHovered ? "60%" : 0 }}
              transition={{ duration: 0.3 }}
            />
          </Link>
        </motion.div>
      ) : (
        <motion.div
          className={cn(
            "relative px-3 py-1.5 rounded-full",
            isLast && "bg-brand-rose/10"
          )}
        >
          <span className={cn(
            "text-xs font-sans tracking-wide capitalize truncate max-w-[120px] sm:max-w-[180px] md:max-w-[250px]",
            isLast ? "text-brand-ink font-medium" : "text-brand-mist"
          )}>
            {item.label}
          </span>
          
          {/* Sparkle animation for current page */}
          {isLast && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="w-3 h-3 text-brand-rose/60" />
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export function Breadcrumbs({ 
  items, 
  className, 
  showHome = true,
  variant = "glass" 
}: BreadcrumbsProps) {
  const [isHovered, setIsHovered] = useState(false);

  const allItems = showHome 
    ? [{ label: "Home", href: "/" }, ...items]
    : items;

  if (variant === "minimal") {
    return (
      <nav
        className={cn(
          "flex items-center gap-1 text-xs font-sans tracking-wide",
          className
        )}
        aria-label="Breadcrumb"
      >
        {allItems.map((item, index) => (
          <BreadcrumbItem
            key={index}
            item={item}
            index={index}
            isLast={index === allItems.length - 1}
          />
        ))}
      </nav>
    );
  }

  // Glass morphism variant (default luxury style)
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative", className)}
      aria-label="Breadcrumb"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <GlassPill>
        <div className="flex items-center">
          {allItems.map((item, index) => (
            <BreadcrumbItem
              key={index}
              item={item}
              index={index}
              isLast={index === allItems.length - 1}
            />
          ))}
        </div>
      </GlassPill>

      {/* Subtle glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-rose/10 via-transparent to-brand-rose/10 blur-xl -z-10"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.nav>
  );
}

// Compact version for mobile or minimal contexts
export function CompactBreadcrumbs({ items, className }: BreadcrumbsProps) {
  const currentItem = items[items.length - 1];
  const parentItem = items.length > 1 ? items[items.length - 2] : null;

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("flex items-center gap-2", className)}
      aria-label="Breadcrumb"
    >
      {parentItem?.href && (
        <>
          <Link
            href={parentItem.href}
            className="flex items-center gap-1 text-xs text-brand-mist hover:text-brand-rose transition-colors"
          >
            <ChevronRight size={14} className="rotate-180" />
            <span className="capitalize">{parentItem.label}</span>
          </Link>
          <span className="text-brand-rose/30">|</span>
        </>
      )}
      <span className="text-xs text-brand-ink font-medium capitalize truncate max-w-[200px]">
        {currentItem?.label}
      </span>
    </motion.nav>
  );
}

// Floating breadcrumb for special product pages
export function FloatingBreadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-24 left-1/2 -translate-x-1/2 z-40",
        "hidden md:block",
        className
      )}
    >
      <div className="px-6 py-3 rounded-full bg-white/80 backdrop-blur-xl border border-brand-rose/10 shadow-lg">
        <Breadcrumbs items={items} showHome={false} variant="minimal" />
      </div>
    </motion.div>
  );
}
