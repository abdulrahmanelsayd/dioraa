"use client";

import { useState, useMemo } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  CreditCard, 
  Truck, 
  User, 
  Check, 
  Loader2, 
  AlertCircle,
  Lock
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { 
  checkoutContactSchema, 
  checkoutShippingSchema, 
  checkoutPaymentSchema,
  type CheckoutContactFormData,
  type CheckoutShippingFormData,
  type CheckoutPaymentFormData
} from "@/features/auth/schemas";
import { useCouponStore } from "@/features/coupons/store/useCouponStore";
import { CouponDrawer, CouponInput } from "@/features/coupons/components";
import Link from "next/link";
import Image from "next/image";

type CheckoutStep = "information" | "shipping" | "payment" | "confirmation";

interface CheckoutData {
  contact: CheckoutContactFormData | null;
  shipping: CheckoutShippingFormData | null;
  payment: CheckoutPaymentFormData | null;
}

const TAX_RATE = 0.08; // 8% tax rate
const FREE_SHIPPING_THRESHOLD = 150;
const SHIPPING_COST = 15;

export default function CheckoutPage() {
  const [step, setStep] = useState<CheckoutStep>("information");
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    contact: null,
    shipping: null,
    payment: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  
  // Coupon store
  const appliedCoupon = useCouponStore((state) => state.appliedCoupon);
  const toggleCouponDrawer = useCouponStore((state) => state.toggleCouponDrawer);

  // Calculate totals
  const subtotal = useMemo(() => 
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const shipping = useMemo(() => 
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST,
    [subtotal]
  );

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

  // Form setups
  const {
    register: registerContact,
    handleSubmit: handleContactSubmit,
    formState: { errors: contactErrors, isSubmitting: isContactSubmitting },
  } = useForm<CheckoutContactFormData>({
    resolver: zodResolver(checkoutContactSchema) as Resolver<CheckoutContactFormData>,
    defaultValues: {
      email: "",
      phone: "",
      marketingConsent: false,
    },
  });

  const {
    register: registerShipping,
    handleSubmit: handleShippingSubmit,
    formState: { errors: shippingErrors, isSubmitting: isShippingSubmitting },
  } = useForm<CheckoutShippingFormData>({
    resolver: zodResolver(checkoutShippingSchema) as Resolver<CheckoutShippingFormData>,
    defaultValues: {
      firstName: "",
      lastName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "USA",
      phone: "",
    },
  });

  const {
    register: registerPayment,
    handleSubmit: handlePaymentSubmit,
    formState: { errors: paymentErrors, isSubmitting: isPaymentSubmitting },
  } = useForm<CheckoutPaymentFormData>({
    resolver: zodResolver(checkoutPaymentSchema) as Resolver<CheckoutPaymentFormData>,
    defaultValues: {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
      saveCard: false,
    },
  });

  const onContactSubmit = async (data: CheckoutContactFormData) => {
    setCheckoutData((prev) => ({ ...prev, contact: data }));
    setStep("shipping");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onShippingSubmit = async (data: CheckoutShippingFormData) => {
    setCheckoutData((prev) => ({ ...prev, shipping: data }));
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onPaymentSubmit = async (data: CheckoutPaymentFormData) => {
    setCheckoutData((prev) => ({ ...prev, payment: data }));
    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Simulate payment processing with network delay
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate 5% chance of network error for testing
          if (Math.random() < 0.05) {
            reject(new Error("Network error"));
          } else {
            resolve(true);
          }
        }, 2000);
      });

      // Generate order number
      const newOrderNumber = `DI-${Date.now().toString().slice(-6)}`;
      setOrderNumber(newOrderNumber);
      
      // Clear cart on successful order
      clearCart();
      
      setStep("confirmation");
    } catch (error) {
      setPaymentError(
        error instanceof Error 
          ? "Payment failed. Please check your connection and try again." 
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-screen bg-brand-offWhite flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-brand-ink mb-4">Your Cart is Empty</h1>
          <p className="text-brand-slate mb-6">Add some luxury items to proceed with checkout</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-ink text-brand-offWhite rounded-full font-sans text-sm uppercase tracking-widest hover:bg-brand-ink/90 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { id: "information", label: "Information", icon: User },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "payment", label: "Payment", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-brand-offWhite">
      {/* Header */}
      <header className="bg-white border-b border-brand-rose/10 sticky top-0 z-40">
        <div className="section-padding max-w-6xl mx-auto py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-serif text-2xl tracking-widest uppercase text-brand-ink">
              DIORA
            </Link>
            {step !== "confirmation" && (
              <button 
                onClick={() => {
                  const toggleCart = useCartStore.getState().toggleCart;
                  toggleCart();
                }}
                className="text-sm text-brand-slate hover:text-brand-ink transition-colors"
              >
                Return to cart
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="section-padding max-w-6xl mx-auto py-8">
        {step !== "confirmation" && (
          <>
            {/* Step Indicator */}
            <nav aria-label="Checkout progress" className="mb-8">
              <ol className="flex items-center justify-center gap-4 md:gap-8">
                {steps.map((s, idx) => {
                  const Icon = s.icon;
                  const isActive = step === s.id;
                  const isCompleted = 
                    (s.id === "information" && checkoutData.contact) ||
                    (s.id === "shipping" && checkoutData.shipping) ||
                    (s.id === "payment" && checkoutData.payment);

                  return (
                    <li key={s.id} className="flex items-center">
                      <button
                        onClick={() => {
                          if (isCompleted || idx < steps.findIndex((st) => st.id === step)) {
                            setStep(s.id as CheckoutStep);
                          }
                        }}
                        disabled={!isCompleted && idx > steps.findIndex((st) => st.id === step)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                          isActive
                            ? "bg-brand-ink text-brand-offWhite"
                            : isCompleted
                            ? "text-brand-rose bg-brand-blush/30"
                            : "text-brand-mist"
                        )}
                        aria-current={isActive ? "step" : undefined}
                      >
                        <span
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                            isActive
                              ? "bg-brand-offWhite text-brand-ink"
                              : isCompleted
                              ? "bg-brand-rose text-white"
                              : "bg-brand-mist/20"
                          )}
                        >
                          {isCompleted ? <Check size={14} /> : idx + 1}
                        </span>
                        <span className="hidden md:inline text-sm font-medium">{s.label}</span>
                      </button>
                      {idx < steps.length - 1 && (
                        <ChevronLeft className="mx-2 md:mx-4 text-brand-mist rotate-180" size={16} />
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Form Area */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {/* Information Step */}
                  {step === "information" && (
                    <motion.div
                      key="information"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-white rounded-luxury shadow-card p-6 md:p-8"
                    >
                      <h2 className="font-serif text-2xl text-brand-ink mb-6">Contact Information</h2>

                      <form onSubmit={handleContactSubmit(onContactSubmit)} className="space-y-5">
                        <div>
                          <label 
                            htmlFor="checkout-email" 
                            className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2"
                          >
                            Email Address
                          </label>
                          <input
                            {...registerContact("email")}
                            id="checkout-email"
                            type="email"
                            autoComplete="email"
                            placeholder="your@email.com"
                            onChange={(e) => {
                              registerContact("email").onChange(e);
                            }}
                            className={cn(
                              "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                              contactErrors.email ? "border-red-300" : "border-brand-rose/20"
                            )}
                          />
                          {contactErrors.email && (
                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle size={12} />
                              {contactErrors.email.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label 
                            htmlFor="checkout-phone" 
                            className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2"
                          >
                            Phone Number
                          </label>
                          <input
                            {...registerContact("phone")}
                            id="checkout-phone"
                            type="tel"
                            autoComplete="tel"
                            inputMode="tel"
                            placeholder="+1 (555) 123-4567"
                            onChange={(e) => {
                              registerContact("phone").onChange(e);
                            }}
                            className={cn(
                              "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                              contactErrors.phone ? "border-red-300" : "border-brand-rose/20"
                            )}
                          />
                          {contactErrors.phone && (
                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle size={12} />
                              {contactErrors.phone.message}
                            </p>
                          )}
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            {...registerContact("marketingConsent")}
                            type="checkbox"
                            className="w-4 h-4 rounded border-brand-rose/30 text-brand-rose focus:ring-brand-rose/30"
                          />
                          <span className="text-sm text-brand-slate">
                            Email me with news and exclusive offers
                          </span>
                        </label>

                        <div className="pt-4">
                          <button
                            type="submit"
                            disabled={isContactSubmitting}
                            className={cn(
                              "w-full py-4 bg-brand-ink text-brand-offWhite font-sans text-sm font-medium",
                              "uppercase tracking-widest rounded-full",
                              "hover:bg-brand-ink/90 active:scale-[0.98]",
                              "transition-all duration-200",
                              "disabled:opacity-50 disabled:cursor-not-allowed",
                              "flex items-center justify-center gap-2"
                            )}
                          >
                            Continue to Shipping
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* Shipping Step */}
                  {step === "shipping" && (
                    <motion.div
                      key="shipping"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-white rounded-luxury shadow-card p-6 md:p-8"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <button
                          onClick={() => setStep("information")}
                          className="p-2 text-brand-mist hover:text-brand-ink hover:bg-brand-blush/30 rounded-full transition-colors"
                          aria-label="Go back to information"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <h2 className="font-serif text-2xl text-brand-ink">Shipping Address</h2>
                      </div>

                      <form onSubmit={handleShippingSubmit(onShippingSubmit)} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                              First Name
                            </label>
                            <input
                              {...registerShipping("firstName")}
                              className={cn(
                                "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                                shippingErrors.firstName ? "border-red-300" : "border-brand-rose/20"
                              )}
                            />
                            {shippingErrors.firstName && (
                              <p className="mt-1 text-xs text-red-500">{shippingErrors.firstName.message}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                              Last Name
                            </label>
                            <input
                              {...registerShipping("lastName")}
                              className={cn(
                                "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                                shippingErrors.lastName ? "border-red-300" : "border-brand-rose/20"
                              )}
                            />
                            {shippingErrors.lastName && (
                              <p className="mt-1 text-xs text-red-500">{shippingErrors.lastName.message}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                            Street Address
                          </label>
                          <input
                            {...registerShipping("address1")}
                            className={cn(
                              "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                              shippingErrors.address1 ? "border-red-300" : "border-brand-rose/20"
                            )}
                          />
                          {shippingErrors.address1 && (
                            <p className="mt-1 text-xs text-red-500">{shippingErrors.address1.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                            Apartment, Suite, etc. <span className="font-normal">(Optional)</span>
                          </label>
                          <input
                            {...registerShipping("address2")}
                            className="w-full px-4 py-3 border border-brand-rose/20 rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                              City
                            </label>
                            <input
                              {...registerShipping("city")}
                              className={cn(
                                "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                                shippingErrors.city ? "border-red-300" : "border-brand-rose/20"
                              )}
                            />
                            {shippingErrors.city && (
                              <p className="mt-1 text-xs text-red-500">{shippingErrors.city.message}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                              State
                            </label>
                            <input
                              {...registerShipping("state")}
                              className={cn(
                                "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                                shippingErrors.state ? "border-red-300" : "border-brand-rose/20"
                              )}
                            />
                            {shippingErrors.state && (
                              <p className="mt-1 text-xs text-red-500">{shippingErrors.state.message}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                              Postal Code
                            </label>
                            <input
                              {...registerShipping("postalCode")}
                              className={cn(
                                "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                                shippingErrors.postalCode ? "border-red-300" : "border-brand-rose/20"
                              )}
                            />
                            {shippingErrors.postalCode && (
                              <p className="mt-1 text-xs text-red-500">{shippingErrors.postalCode.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                              Country
                            </label>
                            <select
                              {...registerShipping("country")}
                              className="w-full px-4 py-3 border border-brand-rose/20 rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30 bg-white"
                            >
                              <option value="USA">United States</option>
                              <option value="CAN">Canada</option>
                              <option value="UK">United Kingdom</option>
                              <option value="AUS">Australia</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                              Phone
                            </label>
                            <input
                              {...registerShipping("phone")}
                              className={cn(
                                "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                                shippingErrors.phone ? "border-red-300" : "border-brand-rose/20"
                              )}
                            />
                            {shippingErrors.phone && (
                              <p className="mt-1 text-xs text-red-500">{shippingErrors.phone.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="pt-4">
                          <button
                            type="submit"
                            disabled={isShippingSubmitting}
                            className={cn(
                              "w-full py-4 bg-brand-ink text-brand-offWhite font-sans text-sm font-medium",
                              "uppercase tracking-widest rounded-full",
                              "hover:bg-brand-ink/90 active:scale-[0.98]",
                              "transition-all duration-200",
                              "disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                          >
                            Continue to Payment
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* Payment Step */}
                  {step === "payment" && (
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-white rounded-luxury shadow-card p-6 md:p-8"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <button
                          onClick={() => setStep("shipping")}
                          className="p-2 text-brand-mist hover:text-brand-ink hover:bg-brand-blush/30 rounded-full transition-colors"
                          aria-label="Go back to shipping"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <h2 className="font-serif text-2xl text-brand-ink">Payment</h2>
                      </div>

                      {/* Order Summary Mobile */}
                      <div className="lg:hidden mb-6">
                        <OrderSummary 
                          items={items}
                          subtotal={subtotal}
                          shipping={shipping}
                          tax={tax}
                          discount={discount}
                          total={total}
                          FREE_SHIPPING_THRESHOLD={FREE_SHIPPING_THRESHOLD}
                          onOpenCouponDrawer={toggleCouponDrawer}
                        />
                      </div>

                      {/* Security Badge */}
                      <div className="flex items-center gap-4 p-4 bg-green-50 rounded-luxury mb-6">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Lock size={20} className="text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-green-800">Secure Payment</p>
                          <p className="text-sm text-green-600">
                            Your payment information is encrypted and secure
                          </p>
                        </div>
                      </div>

                      {/* Payment Error */}
                      {paymentError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-luxury">
                          <div className="flex items-center gap-2 text-red-700">
                            <AlertCircle size={18} />
                            <p className="text-sm font-medium">{paymentError}</p>
                          </div>
                        </div>
                      )}

                      <form onSubmit={handlePaymentSubmit(onPaymentSubmit)} className="space-y-5">
                        <div>
                          <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                            Card Number
                          </label>
                          <div className="relative">
                            <input
                              {...registerPayment("cardNumber")}
                              placeholder="0000 0000 0000 0000"
                              autoComplete="cc-number"
                              inputMode="numeric"
                              onChange={(e) => {
                                // Format with spaces every 4 digits
                                const value = e.target.value.replace(/\s/g, "").replace(/[^0-9]/gi, "");
                                const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
                                e.target.value = formatted.slice(0, 19); // Limit to 16 digits + 3 spaces
                                registerPayment("cardNumber").onChange(e);
                              }}
                              className={cn(
                                "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30 pl-12",
                                paymentErrors.cardNumber ? "border-red-300" : "border-brand-rose/20"
                              )}
                            />
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-mist" size={18} />
                          </div>
                          {paymentErrors.cardNumber && (
                            <p className="mt-1 text-xs text-red-500">{paymentErrors.cardNumber.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                            Cardholder Name
                          </label>
                          <input
                            {...registerPayment("cardHolder")}
                            placeholder="Name as it appears on card"
                            autoComplete="cc-name"
                            className={cn(
                              "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                              paymentErrors.cardHolder ? "border-red-300" : "border-brand-rose/20"
                            )}
                          />
                          {paymentErrors.cardHolder && (
                            <p className="mt-1 text-xs text-red-500">{paymentErrors.cardHolder.message}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                              Expiry Date
                            </label>
                            <input
                              {...registerPayment("expiryDate")}
                              placeholder="MM/YY"
                              maxLength={5}
                              autoComplete="cc-exp"
                              inputMode="numeric"
                              onChange={(e) => {
                                let value = e.target.value.replace(/[^0-9]/g, "");
                                if (value.length >= 2) {
                                  value = value.slice(0, 2) + "/" + value.slice(2, 4);
                                }
                                e.target.value = value;
                                registerPayment("expiryDate").onChange(e);
                              }}
                              className={cn(
                                "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                                paymentErrors.expiryDate ? "border-red-300" : "border-brand-rose/20"
                              )}
                            />
                            {paymentErrors.expiryDate && (
                              <p className="mt-1 text-xs text-red-500">{paymentErrors.expiryDate.message}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                              CVV
                            </label>
                            <input
                              {...registerPayment("cvv")}
                              type="password"
                              placeholder="123"
                              maxLength={4}
                              autoComplete="cc-csc"
                              inputMode="numeric"
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, "");
                                e.target.value = value.slice(0, 4);
                                registerPayment("cvv").onChange(e);
                              }}
                              className={cn(
                                "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                                paymentErrors.cvv ? "border-red-300" : "border-brand-rose/20"
                              )}
                            />
                            {paymentErrors.cvv && (
                              <p className="mt-1 text-xs text-red-500">{paymentErrors.cvv.message}</p>
                            )}
                          </div>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            {...registerPayment("saveCard")}
                            type="checkbox"
                            className="w-4 h-4 rounded border-brand-rose/30 text-brand-rose focus:ring-brand-rose/30"
                          />
                          <span className="text-sm text-brand-slate">Save card for future purchases</span>
                        </label>

                        <div className="pt-4">
                          <button
                            type="submit"
                            disabled={isPaymentSubmitting || isProcessing}
                            className={cn(
                              "w-full py-4 bg-brand-ink text-brand-offWhite font-sans text-sm font-medium",
                              "uppercase tracking-widest rounded-full",
                              "hover:bg-brand-ink/90 active:scale-[0.98]",
                              "transition-all duration-200",
                              "disabled:opacity-50 disabled:cursor-not-allowed",
                              "flex items-center justify-center gap-2"
                            )}
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 size={18} className="animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Lock size={18} />
                                Complete Order — ${total.toFixed(2)}
                              </>
                            )}
                          </button>
                        </div>

                        <p className="text-center text-xs text-brand-mist">
                          By completing your order, you agree to our Terms of Service and Privacy Policy
                        </p>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Order Summary Sidebar - Desktop */}
              <div className="hidden lg:block">
                <div className="sticky top-28">
                  <OrderSummary 
                    items={items}
                    subtotal={subtotal}
                    shipping={shipping}
                    tax={tax}
                    discount={discount}
                    total={total}
                    FREE_SHIPPING_THRESHOLD={FREE_SHIPPING_THRESHOLD}
                    onOpenCouponDrawer={toggleCouponDrawer}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Order Confirmation */}
        {step === "confirmation" && orderNumber && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <Check size={32} className="text-green-600" />
            </div>
            <h1 className="font-serif text-3xl text-brand-ink mb-4">Order Confirmed!</h1>
            <p className="text-brand-slate mb-6">
              Thank you for your purchase. Your order number is:
            </p>
            <p className="font-serif text-2xl text-brand-ink mb-8">{orderNumber}</p>
            <p className="text-brand-slate mb-8">
              We&apos;ve sent a confirmation email to {checkoutData.contact?.email}. 
              You&apos;ll receive another email when your order ships.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-3 bg-brand-ink text-brand-offWhite rounded-full text-sm font-medium uppercase tracking-wider hover:bg-brand-ink/90 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        )}
      </main>

      {/* Coupon Drawer */}
      <CouponDrawer 
        cartTotal={subtotal}
        cartItems={items.map(item => ({ id: item.id, price: item.price, quantity: item.quantity }))}
      />
    </div>
  );
}

// Order Summary Component
interface OrderSummaryProps {
  items: { id: string; name: string; price: number; quantity: number; image: string }[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  FREE_SHIPPING_THRESHOLD: number;
  onOpenCouponDrawer: () => void;
}

function OrderSummary({
  items,
  subtotal,
  shipping,
  tax,
  discount,
  total,
  FREE_SHIPPING_THRESHOLD,
  onOpenCouponDrawer,
}: OrderSummaryProps) {
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const appliedCoupon = useCouponStore((state) => state.appliedCoupon);
  const removeCoupon = useCouponStore((state) => state.removeCoupon);
  
  const cartItems = items.map(item => ({
    id: item.id,
    price: item.price,
    quantity: item.quantity,
  }));

  return (
    <div className="bg-brand-offWhite rounded-luxury p-6 border border-brand-rose/20">
      <h3 className="font-serif text-lg text-brand-ink mb-4">Order Summary</h3>

      {/* Cart Items */}
      <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative w-16 h-16 flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-luxury"
              />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-ink text-white text-xs rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-brand-ink truncate">{item.name}</p>
              <p className="text-sm text-brand-slate">${item.price.toFixed(2)}</p>
            </div>
            <p className="text-sm font-medium text-brand-ink">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <hr className="border-brand-rose/20 mb-6" />

      {/* Coupon Input */}
      <div className="mb-6">
        <CouponInput
          cartTotal={subtotal}
          cartItems={cartItems}
          onOpenDrawer={onOpenCouponDrawer}
          compact
        />
      </div>

      {/* Totals */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-brand-slate">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-brand-slate">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>

        <div className="flex justify-between text-brand-slate">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        {remainingForFreeShipping > 0 && shipping > 0 && (
          <p className="text-xs text-brand-rose">
            Add ${remainingForFreeShipping.toFixed(2)} more for free shipping
          </p>
        )}

        <hr className="border-brand-rose/20" />

        <div className="flex justify-between font-medium text-brand-ink text-base">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
