"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-sans font-medium transition-all duration-300 ease-out rounded-full cursor-pointer",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-rose/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-offWhite",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "bg-brand-ink text-brand-offWhite hover:bg-brand-ink/90 active:scale-[0.97]":
            variant === "primary",
          "border border-brand-ink/20 text-brand-ink bg-transparent hover:bg-brand-ink hover:text-brand-offWhite active:scale-[0.97]":
            variant === "outline",
          "text-brand-ink bg-transparent hover:bg-brand-blush active:scale-[0.97]":
            variant === "ghost",
        },
        {
          "text-xs px-4 py-2": size === "sm",
          "text-sm px-6 py-2.5": size === "md",
          "text-base px-8 py-3": size === "lg",
          "text-lg px-10 py-4": size === "xl",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
