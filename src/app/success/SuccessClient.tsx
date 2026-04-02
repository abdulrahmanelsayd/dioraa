"use client";

import Link from "next/link";
import { CheckCircle, Package, ArrowRight, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

// Generate a realistic mock order number (static for SSR compatibility)
function generateOrderNumber(timestamp: number): string {
  const ts = timestamp.toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `DIOR-${ts}-${random}`;
}

export default function SuccessClient() {
  const [orderDate, setOrderDate] = useState<string>("");
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>("");
  const [orderNumber, setOrderNumber] = useState<string>("");

  useEffect(() => {
    const now = Date.now();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrderNumber(generateOrderNumber(now));
    setEstimatedDelivery(
      new Date(now + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    );
    setOrderDate(
      new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    );
  }, []);

  // Static fallback for SSR
  const displayOrderNumber = orderNumber || "DIOR-PENDING";
  const displayOrderDate = orderDate || "Processing...";
  const displayEstimatedDelivery = estimatedDelivery || "Calculating...";

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
          </div>
        </div>

        {/* Thank You Message */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-2xl sm:text-3xl text-brand-ink mb-3">
            Thank You for Your Order
          </h1>
          <p className="font-sans text-brand-slate text-sm leading-relaxed">
            We&apos;ve received your order and are preparing your premium personal care products with care.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl border border-brand-rose/10 shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-brand-rose/10 bg-brand-offWhite/30">
            <div className="flex items-center gap-2 text-brand-ink/70">
              <Package className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest font-medium">Order Details</span>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Order Number */}
            <div className="flex justify-between items-center">
              <span className="font-sans text-sm text-brand-mist">Order Number</span>
              <span className="font-sans text-sm font-medium text-brand-ink font-mono">
                {displayOrderNumber}
              </span>
            </div>

            {/* Order Date */}
            <div className="flex justify-between items-center">
              <span className="font-sans text-sm text-brand-mist">Order Date</span>
              <span className="font-sans text-sm text-brand-ink">
                {displayOrderDate}
              </span>
            </div>

            {/* Estimated Delivery */}
            <div className="flex justify-between items-center pt-4 border-t border-brand-rose/10">
              <span className="font-sans text-sm text-brand-mist">Estimated Delivery</span>
              <span className="font-sans text-sm font-medium text-emerald-600">
                {displayEstimatedDelivery}
              </span>
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="space-y-4 mb-10">
          <h2 className="font-sans text-xs uppercase tracking-widest font-medium text-brand-ink/70 text-center">
            What Happens Next
          </h2>
          
          <div className="grid grid-cols-3 gap-4">
            {[
              { step: "1", label: "Processing" },
              { step: "2", label: "Shipped" },
              { step: "3", label: "Delivered" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-8 h-8 rounded-full bg-brand-rose/10 text-brand-rose flex items-center justify-center text-xs font-medium mx-auto mb-2">
                  {item.step}
                </div>
                <span className="font-sans text-xs text-brand-mist">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Link
            href="/shop"
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-brand-ink text-white font-sans text-sm font-medium hover:bg-brand-ink/90 active:scale-[0.98] transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="text-center font-sans text-xs text-brand-mist">
            A confirmation email has been sent to your inbox.
          </p>
        </div>
      </div>
    </div>
  );
}
