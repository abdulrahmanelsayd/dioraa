"use client";

import { motion } from "framer-motion";
import { pageTransition } from "@/shared/theme/animations";

interface PageTransitionWrapperProps {
  children: React.ReactNode;
}

export function PageTransitionWrapper({ children }: PageTransitionWrapperProps) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col w-full"
    >
      {children}
    </motion.div>
  );
}
