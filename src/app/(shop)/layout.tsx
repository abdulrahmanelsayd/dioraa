"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: { label: string; href: string }[] = [];

  segments.forEach((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    // Convert "product" segment to "shop" with correct link
    const isProductSegment = segment === "product" && index === 0;
    const label = isProductSegment
      ? "Shop"
      : segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
    breadcrumbs.push({ label, href: isProductSegment ? "/shop" : href });
  });

  return breadcrumbs;
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="section-padding pt-6 pb-4" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-xs font-sans">
          <li>
            <Link
              href="/"
              className="text-brand-mist hover:text-brand-rose transition-colors flex items-center gap-1"
            >
              <Home size={12} />
              <span>Home</span>
            </Link>
          </li>
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.href} className="flex items-center gap-2">
              <ChevronRight size={12} className="text-brand-petal" />
              {index === breadcrumbs.length - 1 ? (
                <span className="text-brand-ink font-medium uppercase tracking-wider">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-brand-mist hover:text-brand-rose transition-colors uppercase tracking-wider"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      {children}
    </>
  );
}
