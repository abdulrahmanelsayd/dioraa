"use client";

import Link from "next/link";
import Image from "next/image";

const FOOTER_LINKS = {
  shop: [
    { label: "Shop All", href: "/shop" },
  ],
  about: [
    { label: "Our Story", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="w-full bg-brand-ink text-white">
      {/* Main Footer */}
      <div className="max-w-[1920px] mx-auto px-8 sm:px-12 lg:px-20 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-8 lg:gap-16">
          {/* Brand - full width on mobile, normal on desktop */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/LOGO.png"
              alt="DIORA"
              width={140}
              height={50}
              className="h-10 sm:h-12 w-auto object-contain mb-6 invert"
            />
            <p className="text-sm text-white/40 font-light leading-relaxed max-w-xs">
              Premium personal care crafted with intention. Purity in every drop.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-white/30 font-light mb-6">
              Shop
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-brand-rose transition-colors duration-300 font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-white/30 font-light mb-6">
              About
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.about.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-brand-rose transition-colors duration-300 font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1920px] mx-auto px-8 sm:px-12 lg:px-20 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-white/30 tracking-wider font-light">
              © 2016 DIORA
            </p>
            <p className="text-[11px] text-white/30 tracking-wider font-light">
              Cash on Delivery
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
