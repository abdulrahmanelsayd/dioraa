"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Truck, 
  Check, 
  Loader2, 
  AlertCircle,
  ShoppingBag,
  MapPin,
  Phone,
  Package,
  Sparkles,
  ArrowRight,
  Mail
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { 
  checkoutShippingSchema, 
  type CheckoutShippingFormData
} from "@/features/auth/schemas";
import { useCouponStore } from "@/features/coupons/store/useCouponStore";
import { CouponDrawer, CouponInput } from "@/features/coupons/components";
import Link from "next/link";
import Image from "next/image";

type CheckoutStep = "shipping" | "confirmation";

interface CheckoutData {
  shipping: CheckoutShippingFormData | null;
  payment: { method: "cod" } | null;
}

const TAX_RATE = 0.14;
const SHIPPING_COST = 50;

export default function CheckoutPage() {
  const [step, setStep] = useState<CheckoutStep>("shipping");
  const [, setCheckoutData] = useState<CheckoutData>({
    shipping: null,
    payment: { method: "cod" },
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  
  const appliedCoupon = useCouponStore((state) => state.appliedCoupon);
  const toggleCouponDrawer = useCouponStore((state) => state.toggleCouponDrawer);

  const subtotal = useMemo(() => 
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const shipping = useMemo(() => SHIPPING_COST, []);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return appliedCoupon.discountAmount;
  }, [appliedCoupon]);

  const tax = useMemo(() => 
    Math.max(0, (subtotal - discount) * TAX_RATE),
    [subtotal, discount]
  );

  const total = useMemo(() => 
    Math.max(0, subtotal - discount + shipping + tax),
    [subtotal, discount, shipping, tax]
  );

  const {
    register: registerShipping,
    handleSubmit: handleShippingSubmit,
    formState: { errors: shippingErrors, isSubmitting: isShippingSubmitting },
  } = useForm<CheckoutShippingFormData>({
    resolver: zodResolver(checkoutShippingSchema) as Resolver<CheckoutShippingFormData>,
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      phone: "",
    },
  });

  const onShippingSubmit = async (data: CheckoutShippingFormData) => {
    setCheckoutData((prev) => ({ ...prev, shipping: data }));
    setIsProcessing(true);
    setPaymentError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const newOrderNumber = `DI-${Date.now().toString().slice(-6)}`;
      setOrderNumber(newOrderNumber);
      clearCart();
      setStep("confirmation");
    } catch {
      setPaymentError("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-blush/20 via-brand-offWhite to-brand-offWhite flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-brand-blush/30 flex items-center justify-center">
            <ShoppingBag size={40} className="text-brand-rose/50" />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-blush/20 via-brand-offWhite to-brand-offWhite flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-brand-blush/30 flex items-center justify-center">
            <ShoppingBag size={40} className="text-brand-rose" />
          </div>
          <h1 className="font-serif text-4xl text-brand-ink mb-4 tracking-wide">Your Cart Awaits</h1>
          <p className="text-brand-slate mb-10 text-lg leading-relaxed">
            Discover our curated collection of luxury beauty essentials
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-10 py-4 bg-brand-ink text-brand-offWhite rounded-full font-sans text-sm uppercase tracking-[0.2em] hover:bg-brand-ink/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Explore Collection
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-blush/10 via-brand-offWhite to-brand-offWhite">
      {/* Progress Indicator - Above Header with Pink Background */}
      {step !== "confirmation" && (
        <div className="bg-brand-blush/40 border-b border-brand-rose/10 py-4 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3 sm:gap-6 bg-white/70 backdrop-blur-sm rounded-full px-4 sm:px-10 py-3 sm:py-5 shadow-lg shadow-brand-rose/10 border border-white/50">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-brand-rose/20 flex items-center justify-center">
                    <Truck size={16} className="sm:hidden text-brand-rose" />
                    <Truck size={20} className="hidden sm:block text-brand-rose" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-brand-ink uppercase tracking-wider">Shipping</span>
                </div>
                <div className="w-8 sm:w-16 h-px bg-brand-rose/40" />
                <div className="flex items-center gap-2 sm:gap-3 opacity-50">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-brand-blush/40 flex items-center justify-center">
                    <Check size={16} className="sm:hidden text-brand-slate" />
                    <Check size={20} className="hidden sm:block text-brand-slate" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-brand-slate uppercase tracking-wider">Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {step !== "confirmation" && (
          <>
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12">
              {/* Main Form Area */}
              <div className="order-2 lg:order-1 lg:col-span-7 xl:col-span-8">
                <AnimatePresence mode="wait">
                  {step === "shipping" && (
                    <motion.div
                      key="shipping"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      {/* Section Title */}
                      <div className="mb-6 sm:mb-8">
                        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-brand-ink mb-2 sm:mb-3">Delivery Details</h2>
                        <p className="text-sm sm:text-base text-brand-slate">Enter your information for a seamless delivery experience</p>
                      </div>

                      {/* Elegant Form Card */}
                      <div className="bg-white rounded-2xl shadow-xl shadow-brand-rose/5 border border-brand-rose/10 overflow-hidden">
                        <div className="p-5 sm:p-8 lg:p-10">
                          <form onSubmit={handleShippingSubmit(onShippingSubmit)} className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-wider text-brand-slate">
                                <Mail size={14} className="text-brand-rose/60" />
                                Email Address
                              </label>
                              <input
                                {...registerShipping("email")}
                                type="email"
                                placeholder="ahmed@example.com"
                                className={cn(
                                  "w-full px-5 py-4 bg-brand-offWhite/50 border rounded-xl text-brand-ink placeholder:text-brand-mist/60",
                                  "focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:bg-white transition-all duration-300",
                                  shippingErrors.email ? "border-red-300" : "border-brand-rose/20 hover:border-brand-rose/40"
                                )}
                              />
                              {shippingErrors.email && (
                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                  <AlertCircle size={12} />
                                  {shippingErrors.email.message}
                                </p>
                              )}
                            </div>

                            {/* Name Fields */}
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-wider text-brand-slate">
                                  <Package size={14} className="text-brand-rose/60" />
                                  First Name
                                </label>
                                <input
                                  {...registerShipping("firstName")}
                                  placeholder="Ahmed"
                                  className={cn(
                                    "w-full px-5 py-4 bg-brand-offWhite/50 border rounded-xl text-brand-ink placeholder:text-brand-mist/60",
                                    "focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:bg-white transition-all duration-300",
                                    shippingErrors.firstName ? "border-red-300" : "border-brand-rose/20 hover:border-brand-rose/40"
                                  )}
                                />
                                {shippingErrors.firstName && (
                                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                    <AlertCircle size={12} />
                                    {shippingErrors.firstName.message}
                                  </p>
                                )}
                              </div>
                              <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-wider text-brand-slate">
                                  <Package size={14} className="text-brand-rose/60" />
                                  Last Name
                                </label>
                                <input
                                  {...registerShipping("lastName")}
                                  placeholder="Hassan"
                                  className={cn(
                                    "w-full px-5 py-4 bg-brand-offWhite/50 border rounded-xl text-brand-ink placeholder:text-brand-mist/60",
                                    "focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:bg-white transition-all duration-300",
                                    shippingErrors.lastName ? "border-red-300" : "border-brand-rose/20 hover:border-brand-rose/40"
                                  )}
                                />
                                {shippingErrors.lastName && (
                                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                    <AlertCircle size={12} />
                                    {shippingErrors.lastName.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Address Fields */}
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-wider text-brand-slate">
                                <MapPin size={14} className="text-brand-rose/60" />
                                Street Address
                              </label>
                              <input
                                {...registerShipping("address1")}
                                placeholder="12 Nile Street, Zamalek"
                                className={cn(
                                  "w-full px-5 py-4 bg-brand-offWhite/50 border rounded-xl text-brand-ink placeholder:text-brand-mist/60",
                                  "focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:bg-white transition-all duration-300",
                                  shippingErrors.address1 ? "border-red-300" : "border-brand-rose/20 hover:border-brand-rose/40"
                                )}
                              />
                              {shippingErrors.address1 && (
                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                  <AlertCircle size={12} />
                                  {shippingErrors.address1.message}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-wider text-brand-slate">
                                <MapPin size={14} className="text-brand-rose/60 opacity-50" />
                                Apartment, Suite, etc. <span className="font-normal normal-case text-brand-mist">(Optional)</span>
                              </label>
                              <input
                                {...registerShipping("address2")}
                                placeholder="Floor 3, Apt 5"
                                className="w-full px-5 py-4 bg-brand-offWhite/50 border border-brand-rose/20 rounded-xl text-brand-ink placeholder:text-brand-mist/60 focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:bg-white transition-all duration-300 hover:border-brand-rose/40"
                              />
                            </div>

                            {/* City & State */}
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-wider text-brand-slate">
                                  <MapPin size={14} className="text-brand-rose/60" />
                                  City
                                </label>
                                <input
                                  {...registerShipping("city")}
                                  placeholder="Cairo"
                                  className={cn(
                                    "w-full px-5 py-4 bg-brand-offWhite/50 border rounded-xl text-brand-ink placeholder:text-brand-mist/60",
                                    "focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:bg-white transition-all duration-300",
                                    shippingErrors.city ? "border-red-300" : "border-brand-rose/20 hover:border-brand-rose/40"
                                  )}
                                />
                                {shippingErrors.city && (
                                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                    <AlertCircle size={12} />
                                    {shippingErrors.city.message}
                                  </p>
                                )}
                              </div>
                              <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-wider text-brand-slate">
                                  <MapPin size={14} className="text-brand-rose/60" />
                                  Governorate
                                </label>
                                <input
                                  {...registerShipping("state")}
                                  placeholder="Giza"
                                  className={cn(
                                    "w-full px-5 py-4 bg-brand-offWhite/50 border rounded-xl text-brand-ink placeholder:text-brand-mist/60",
                                    "focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:bg-white transition-all duration-300",
                                    shippingErrors.state ? "border-red-300" : "border-brand-rose/20 hover:border-brand-rose/40"
                                  )}
                                />
                                {shippingErrors.state && (
                                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                    <AlertCircle size={12} />
                                    {shippingErrors.state.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-wider text-brand-slate">
                                <Phone size={14} className="text-brand-rose/60" />
                                Phone Number
                              </label>
                              <input
                                {...registerShipping("phone")}
                                placeholder="+20 10 1234 5678"
                                className={cn(
                                  "w-full px-5 py-4 bg-brand-offWhite/50 border rounded-xl text-brand-ink placeholder:text-brand-mist/60",
                                  "focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:bg-white transition-all duration-300",
                                  shippingErrors.phone ? "border-red-300" : "border-brand-rose/20 hover:border-brand-rose/40"
                                )}
                              />
                              {shippingErrors.phone && (
                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                  <AlertCircle size={12} />
                                  {shippingErrors.phone.message}
                                </p>
                              )}
                            </div>

                            {/* COD Section */}
                            <div className="pt-4">
                              <div className="bg-gradient-to-r from-brand-blush/30 to-brand-rose/10 rounded-2xl p-6 border border-brand-rose/20">
                                <div className="flex items-start gap-4">
                                  <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center flex-shrink-0">
                                    <Truck size={24} className="text-brand-rose" />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-serif text-xl text-brand-ink mb-1">Cash on Delivery</h3>
                                    <p className="text-sm text-brand-slate mb-3">
                                      Pay <span className="font-medium text-brand-ink">{total.toFixed(2)} EGP</span> when your order arrives at your doorstep
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-brand-rose">
                                      <span className="uppercase tracking-wider font-medium">No prepayment required</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Payment Error */}
                            {paymentError && (
                              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                <div className="flex items-center gap-2 text-red-700">
                                  <AlertCircle size={18} />
                                  <p className="text-sm font-medium">{paymentError}</p>
                                </div>
                              </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-4">
                              <button
                                type="submit"
                                disabled={isShippingSubmitting || isProcessing}
                                className={cn(
                                  "w-full py-5 bg-brand-ink text-brand-offWhite font-sans text-sm font-medium",
                                  "uppercase tracking-[0.2em] rounded-full",
                                  "hover:bg-brand-ink/90 hover:shadow-xl hover:shadow-brand-rose/20",
                                  "active:scale-[0.98]",
                                  "transition-all duration-300",
                                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
                                  "flex items-center justify-center gap-3"
                                )}
                              >
                                {isProcessing ? (
                                  <>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span>Processing Your Order...</span>
                                  </>
                                ) : (
                                  <>
                                    <span>Complete Order</span>
                                    <span className="opacity-60">—</span>
                                    <span>{total.toFixed(2)} EGP</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <p className="text-center text-xs text-brand-mist/80">
                              By completing your order, you agree to our Terms of Service and Privacy Policy
                            </p>
                          </form>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Premium Order Summary Sidebar */}
              <div className="order-1 lg:order-2 lg:col-span-5 xl:col-span-4">
                <div className="lg:sticky lg:top-28">
                  <OrderSummary 
                    items={items}
                    subtotal={subtotal}
                    shipping={shipping}
                    tax={tax}
                    discount={discount}
                    total={total}
                    onOpenCouponDrawer={toggleCouponDrawer}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Celebratory Order Confirmation */}
        {step === "confirmation" && orderNumber && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto text-center px-4 py-6 sm:py-8"
          >
            {/* Animated Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8"
            >
              <div className="absolute inset-0 rounded-full bg-brand-rose/20 animate-ping" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-brand-rose to-brand-rose/80 flex items-center justify-center shadow-xl shadow-brand-rose/30">
                <Check size={36} className="sm:hidden text-white" strokeWidth={3} />
                <Check size={48} className="hidden sm:block text-white" strokeWidth={3} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-ink mb-3 sm:mb-4 tracking-wide">
                Order Confirmed
              </h1>
              <p className="text-brand-slate text-base sm:text-lg mb-6 sm:mb-8 max-w-md mx-auto px-4">
                Thank you for choosing Diora. Your luxury beauty essentials are being prepared with care.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-xl shadow-brand-rose/10 border border-brand-rose/10 p-6 sm:p-8 mb-6 sm:mb-8 mx-4"
            >
              <p className="text-xs sm:text-sm text-brand-slate uppercase tracking-wider mb-2">Your Order Number</p>
              <p className="font-serif text-2xl sm:text-3xl text-brand-ink tracking-widest">{orderNumber}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-brand-slate mb-6 sm:mb-8 text-sm sm:text-base">
                We&apos;ve sent a confirmation to your phone.<br className="hidden sm:block" />
                You&apos;ll receive tracking updates once your order ships.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 bg-brand-ink text-brand-offWhite rounded-full text-xs sm:text-sm font-medium uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:bg-brand-ink/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Continue Shopping
                <ArrowRight size={14} className="sm:hidden" />
                <ArrowRight size={16} className="hidden sm:block" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </main>

      <CouponDrawer 
        cartTotal={subtotal}
        cartItems={items.map(item => ({ id: item.id, price: item.price, quantity: item.quantity }))}
      />
    </div>
  );
}

// Premium Order Summary Component
interface OrderSummaryProps {
  items: { id: string; name: string; price: number; quantity: number; image: string }[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  onOpenCouponDrawer: () => void;
}

function OrderSummary({
  items,
  subtotal,
  shipping,
  tax,
  discount,
  total,
  onOpenCouponDrawer,
}: OrderSummaryProps) {
  const cartItems = items.map(item => ({
    id: item.id,
    price: item.price,
    quantity: item.quantity,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-brand-rose/5 border border-brand-rose/10 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-blush/30 to-brand-rose/10 p-4 sm:p-6 border-b border-brand-rose/10">
        <h3 className="font-serif text-xl sm:text-2xl text-brand-ink">Order Summary</h3>
        <p className="text-xs sm:text-sm text-brand-slate mt-1">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
      </div>

      <div className="p-4 sm:p-6">
        {/* Cart Items */}
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-48 sm:max-h-64 overflow-y-auto pr-2">
          {items.map((item, idx) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex gap-4 p-3 bg-brand-offWhite/50 rounded-xl"
            >
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-brand-ink/10" />
                <span className="absolute top-0 right-0 w-5 h-5 bg-brand-rose text-white text-xs rounded-full flex items-center justify-center font-medium shadow-sm">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <p className="text-sm font-medium text-brand-ink truncate">{item.name}</p>
                <p className="text-xs text-brand-slate mt-0.5">{item.price.toFixed(2)} EGP</p>
              </div>
              <div className="flex items-center">
                <p className="text-sm font-medium text-brand-ink">
                  {(item.price * item.quantity).toFixed(2)} EGP
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-brand-rose/20 to-transparent my-4 sm:my-6" />

        {/* Coupon Section */}
        <div className="mb-4 sm:mb-6">
          <CouponInput
            cartTotal={subtotal}
            cartItems={cartItems}
            onOpenDrawer={onOpenCouponDrawer}
            compact
          />
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-brand-rose/20 to-transparent my-4 sm:my-6" />

        {/* Totals */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-brand-slate">Subtotal</span>
            <span className="text-brand-ink font-medium">{subtotal.toFixed(2)} EGP</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-green-600 flex items-center gap-1">
                <Sparkles size={12} />
                Discount
              </span>
              <span className="text-green-600 font-medium">-{discount.toFixed(2)} EGP</span>
            </div>
          )}

          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-brand-slate">Shipping</span>
            <span className={cn(
              "font-medium",
              shipping === 0 ? "text-green-600" : "text-brand-ink"
            )}>
              {shipping === 0 ? "Complimentary" : `${shipping.toFixed(2)} EGP`}
            </span>
          </div>

          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-brand-slate">Tax</span>
            <span className="text-brand-ink font-medium">{tax.toFixed(2)} EGP</span>
          </div>

          {/* Total */}
          <div className="pt-3 sm:pt-4 border-t border-brand-rose/20">
            <div className="flex justify-between items-center">
              <span className="font-serif text-lg sm:text-xl text-brand-ink">Total</span>
              <span className="font-serif text-xl sm:text-2xl text-brand-ink">{total.toFixed(2)} EGP</span>
            </div>
            <p className="text-[10px] sm:text-xs text-brand-slate text-right mt-1">Including taxes & shipping</p>
          </div>
        </div>
      </div>

      {/* Bottom Trust Badge */}
      <div className="bg-brand-offWhite/50 p-3 sm:p-4 border-t border-brand-rose/10">
        <div className="flex items-center justify-center gap-2 text-xs text-brand-slate">
          <Check size={12} className="text-brand-rose" />
          <span>Cash on Delivery available</span>
        </div>
      </div>
    </div>
  );
}
