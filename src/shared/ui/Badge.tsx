"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "discount" | "new" | "default";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider",
        {
          "bg-brand-rose text-white": variant === "discount",
          "bg-brand-ink text-brand-offWhite": variant === "new",
          "bg-brand-blush text-brand-deepRose": variant === "default",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
