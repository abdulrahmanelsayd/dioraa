"use client";

interface PageTransitionWrapperProps {
  children: React.ReactNode;
}

export function PageTransitionWrapper({ children }: PageTransitionWrapperProps) {
  return (
    <div className="flex flex-col w-full animate-page-enter">
      {children}
    </div>
  );
}
