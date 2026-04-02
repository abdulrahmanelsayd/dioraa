import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { 
  Coupon, 
  AppliedCoupon, 
  CouponValidationResult,
  CouponSuggestion 
} from "../types";

// Sample luxury coupons
const LUXURY_COUPONS: Coupon[] = [
  {
    id: "welcome-luxury",
    code: "WELCOME20",
    name: "Welcome to Diora",
    description: "Enjoy 20% off your first order as a welcome gift",
    type: "percentage",
    value: 20,
    status: "active",
    restrictions: {
      minimumPurchase: 100,
      maximumDiscount: 100,
      firstTimeOnly: true,
    },
    badge: "Welcome Gift",
    gradient: "from-brand-rose to-brand-deepRose",
    icon: "gift",
    validFrom: new Date("2024-01-01"),
    validUntil: new Date("2025-12-31"),
    createdAt: new Date("2024-01-01"),
    timesUsed: 0,
    maxUsesPerUser: 1,
  },
  {
    id: "vip-exclusive",
    code: "VIP25",
    name: "VIP Exclusive",
    description: "Exclusive 25% discount for our valued customers",
    type: "percentage",
    value: 25,
    status: "active",
    restrictions: {
      minimumPurchase: 200,
      maximumDiscount: 150,
    },
    badge: "VIP",
    gradient: "from-amber-400 to-amber-600",
    icon: "crown",
    validFrom: new Date("2024-01-01"),
    validUntil: new Date("2025-12-31"),
    createdAt: new Date("2024-01-01"),
    timesUsed: 0,
    maxUsesPerUser: 3,
  },
  {
    id: "free-shipping-special",
    code: "LUXURYSHIP",
    name: "Complimentary Shipping",
    description: "Free express shipping on any order",
    type: "free_shipping",
    value: 0,
    status: "active",
    restrictions: {
      minimumPurchase: 75,
    },
    badge: "Free Shipping",
    gradient: "from-emerald-400 to-teal-500",
    icon: "truck",
    validFrom: new Date("2024-01-01"),
    validUntil: new Date("2025-12-31"),
    createdAt: new Date("2024-01-01"),
    timesUsed: 0,
    maxUsesPerUser: 10,
  },
  {
    id: "tiered-savings",
    code: "TIERED",
    name: "Tiered Savings",
    description: "The more you spend, the more you save",
    type: "tiered",
    value: 0,
    status: "active",
    restrictions: {
      minimumPurchase: 100,
    },
    tiers: [
      { minPurchase: 100, discount: 10, type: "percentage" },
      { minPurchase: 200, discount: 15, type: "percentage" },
      { minPurchase: 350, discount: 20, type: "percentage" },
    ],
    badge: "Tiered",
    gradient: "from-purple-400 to-indigo-500",
    icon: "sparkles",
    validFrom: new Date("2024-01-01"),
    validUntil: new Date("2025-12-31"),
    createdAt: new Date("2024-01-01"),
    timesUsed: 0,
    maxUsesPerUser: 5,
  },
  {
    id: "buy-more-save",
    code: "BUY3GET1",
    name: "Buy 3, Get 1 Free",
    description: "Buy any 3 products and get the 4th free",
    type: "buy_x_get_y",
    value: 0,
    status: "active",
    restrictions: {
      minimumPurchase: 150,
    },
    buyXGetY: {
      buyQuantity: 3,
      getQuantity: 1,
      discountPercent: 100,
    },
    badge: "Buy 3 Get 1",
    gradient: "from-pink-400 to-rose-500",
    icon: "gift",
    validFrom: new Date("2024-01-01"),
    validUntil: new Date("2025-12-31"),
    createdAt: new Date("2024-01-01"),
    timesUsed: 0,
    maxUsesPerUser: 3,
  },
  {
    id: "flash-sale",
    code: "FLASH30",
    name: "Flash Sale",
    description: "Limited time: 30% off everything",
    type: "percentage",
    value: 30,
    status: "active",
    restrictions: {
      minimumPurchase: 50,
      maximumDiscount: 200,
      maxUses: 500,
      currentUses: 127,
    },
    badge: "Flash Sale",
    gradient: "from-red-400 to-orange-500",
    icon: "percent",
    validFrom: new Date("2024-01-01"),
    validUntil: new Date("2025-12-31"),
    createdAt: new Date("2024-01-01"),
    timesUsed: 127,
    maxUsesPerUser: 1,
  },
  {
    id: "fixed-discount",
    code: "SAVE50",
    name: "$50 Off",
    description: "Save $50 on orders over $250",
    type: "fixed",
    value: 50,
    status: "active",
    restrictions: {
      minimumPurchase: 250,
    },
    badge: "$50 Off",
    gradient: "from-slate-600 to-slate-800",
    icon: "sparkles",
    validFrom: new Date("2024-01-01"),
    validUntil: new Date("2025-12-31"),
    createdAt: new Date("2024-01-01"),
    timesUsed: 0,
    maxUsesPerUser: 2,
  },
];

interface CouponState {
  // Available coupons
  availableCoupons: Coupon[];
  
  // Applied coupon
  appliedCoupon: AppliedCoupon | null;
  
  // Used coupons (for tracking)
  usedCoupons: string[];
  
  // UI state
  isCouponDrawerOpen: boolean;
  couponInputValue: string;
  validationError: string | null;
  validationWarning: string | null;
  
  // Actions
  validateCoupon: (code: string, cartTotal: number, itemCount: number) => CouponValidationResult;
  applyCoupon: (code: string, cartTotal: number, cartItems: { id: string; price: number; quantity: number; category?: string }[]) => boolean;
  removeCoupon: () => void;
  
  // Calculate discount
  calculateDiscount: (coupon: Coupon, cartTotal: number, cartItems: { id: string; price: number; quantity: number; category?: string }[]) => number;
  
  // Suggestions
  getSuggestions: (cartTotal: number, cartItems: { id: string; price: number; quantity: number; category?: string }[]) => CouponSuggestion[];
  
  // UI Actions
  toggleCouponDrawer: () => void;
  setCouponInputValue: (value: string) => void;
  clearValidation: () => void;
  
  // Get coupon by code
  getCouponByCode: (code: string) => Coupon | undefined;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set, get) => ({
      availableCoupons: LUXURY_COUPONS,
      appliedCoupon: null,
      usedCoupons: [],
      isCouponDrawerOpen: false,
      couponInputValue: "",
      validationError: null,
      validationWarning: null,
      
      getCouponByCode: (code: string) => {
        const { availableCoupons } = get();
        return availableCoupons.find(
          (c) => c.code.toUpperCase() === code.toUpperCase()
        );
      },
      
      validateCoupon: (code: string, cartTotal: number, // eslint-disable-next-line @typescript-eslint/no-unused-vars
itemCount: number) => {
        const { availableCoupons, usedCoupons, appliedCoupon } = get();
        
        // Check if already applied
        if (appliedCoupon) {
          return {
            valid: false,
            error: "A coupon is already applied. Remove it first to apply a different one.",
          };
        }
        
        const coupon = availableCoupons.find(
          (c) => c.code.toUpperCase() === code.toUpperCase()
        );
        
        if (!coupon) {
          return {
            valid: false,
            error: "This coupon code is not valid. Please check and try again.",
          };
        }
        
        // Check status
        if (coupon.status === "expired") {
          return {
            valid: false,
            error: "This coupon has expired.",
          };
        }
        
        if (coupon.status === "upcoming") {
          return {
            valid: false,
            error: "This coupon is not yet active.",
          };
        }
        
        // Check dates
        const now = new Date();
        if (now < new Date(coupon.validFrom)) {
          return {
            valid: false,
            error: "This coupon is not yet valid.",
          };
        }
        
        if (now > new Date(coupon.validUntil)) {
          return {
            valid: false,
            error: "This coupon has expired.",
          };
        }
        
        // Check minimum purchase
        if (coupon.restrictions.minimumPurchase && cartTotal < coupon.restrictions.minimumPurchase) {
          return {
            valid: false,
            error: `This coupon requires a minimum purchase of $${coupon.restrictions.minimumPurchase}. Add $${(coupon.restrictions.minimumPurchase - cartTotal).toFixed(2)} more to your cart.`,
          };
        }
        
        // Check max uses
        if (coupon.restrictions.maxUses && coupon.restrictions.currentUses && 
            coupon.restrictions.currentUses >= coupon.restrictions.maxUses) {
          return {
            valid: false,
            error: "This coupon has reached its maximum uses.",
          };
        }
        
        // Check user usage
        const userUsageCount = usedCoupons.filter((id) => id === coupon.id).length;
        if (userUsageCount >= coupon.maxUsesPerUser) {
          return {
            valid: false,
            error: `You've already used this coupon the maximum number of times (${coupon.maxUsesPerUser}).`,
          };
        }
        
        // Calculate estimated discount
        const state = get();
        const estimatedDiscount = state.calculateDiscount(coupon, cartTotal, []);
        
        // Check if discount would be $0
        if (estimatedDiscount === 0 && coupon.type !== "free_shipping") {
          return {
            valid: false,
            error: "This coupon would not provide any discount on your current cart.",
          };
        }
        
        // Warning for free shipping
        let warning: string | undefined;
        if (coupon.type === "free_shipping" && cartTotal >= 150) {
          warning = "Note: You already qualify for free shipping on orders over $150!";
        }
        
        return {
          valid: true,
          warning,
          estimatedDiscount,
        };
      },
      
      calculateDiscount: (coupon: Coupon, cartTotal: number, cartItems: { id: string; price: number; quantity: number; category?: string }[]) => {
        let discount = 0;
        
        switch (coupon.type) {
          case "percentage": {
            discount = cartTotal * (coupon.value / 100);
            if (coupon.restrictions.maximumDiscount) {
              discount = Math.min(discount, coupon.restrictions.maximumDiscount);
            }
            break;
          }
          
          case "fixed": {
            discount = Math.min(coupon.value, cartTotal);
            break;
          }
          
          case "free_shipping": {
            // Free shipping discount is calculated separately
            discount = 0;
            break;
          }
          
          case "tiered": {
            if (coupon.tiers) {
              const applicableTier = [...coupon.tiers]
                .reverse()
                .find((tier) => cartTotal >= tier.minPurchase);
              
              if (applicableTier) {
                discount = cartTotal * (applicableTier.discount / 100);
              }
            }
            break;
          }
          
          case "buy_x_get_y": {
            if (coupon.buyXGetY && cartItems.length > 0) {
              const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
              const { buyQuantity, getQuantity, discountPercent } = coupon.buyXGetY;
              
              // Calculate how many "get" items qualify
              const qualifyingSets = Math.floor(totalQuantity / (buyQuantity + getQuantity));
              
              if (qualifyingSets > 0) {
                // Find cheapest items to discount
                const sortedItems = [...cartItems].sort((a, b) => a.price - b.price);
                let itemsToDiscount = qualifyingSets * getQuantity;
                
                for (const item of sortedItems) {
                  if (itemsToDiscount <= 0) break;
                  const discountableQty = Math.min(item.quantity, itemsToDiscount);
                  discount += item.price * discountableQty * (discountPercent / 100);
                  itemsToDiscount -= discountableQty;
                }
              }
            }
            break;
          }
        }
        
        return Math.round(discount * 100) / 100;
      },
      
      applyCoupon: (code: string, cartTotal: number, cartItems: { id: string; price: number; quantity: number; category?: string }[]) => {
        const state = get();
        const validation = state.validateCoupon(code, cartTotal, cartItems.length);
        
        if (!validation.valid) {
          set({
            validationError: validation.error || null,
            validationWarning: null,
          });
          return false;
        }
        
        const coupon = state.getCouponByCode(code);
        if (!coupon) return false;
        
        const discountAmount = state.calculateDiscount(coupon, cartTotal, cartItems);
        
        set({
          appliedCoupon: {
            coupon,
            discountAmount,
            appliedAt: new Date(),
          },
          validationError: null,
          validationWarning: validation.warning || null,
          couponInputValue: "",
          isCouponDrawerOpen: false,
        });
        
        return true;
      },
      
      removeCoupon: () => {
        set({
          appliedCoupon: null,
          validationError: null,
          validationWarning: null,
        });
      },
      
      getSuggestions: (cartTotal: number, cartItems: { id: string; price: number; quantity: number; category?: string }[]) => {
        const { availableCoupons, appliedCoupon, usedCoupons } = get();
        const suggestions: CouponSuggestion[] = [];
        
        for (const coupon of availableCoupons) {
          // Skip already applied
          if (appliedCoupon?.coupon.id === coupon.id) continue;
          
          // Skip expired/upcoming
          if (coupon.status !== "active") continue;
          
          const now = new Date();
          if (now < new Date(coupon.validFrom) || now > new Date(coupon.validUntil)) continue;
          
          // Check minimum purchase
          if (coupon.restrictions.minimumPurchase && cartTotal < coupon.restrictions.minimumPurchase) {
            // Still suggest if close to threshold
            const diff = coupon.restrictions.minimumPurchase - cartTotal;
            if (diff > 50) continue;
          }
          
          // Check user usage
          const userUsageCount = usedCoupons.filter((id) => id === coupon.id).length;
          if (userUsageCount >= coupon.maxUsesPerUser) continue;
          
          // Calculate savings
          const state = get();
          const savingsAmount = state.calculateDiscount(coupon, cartTotal, cartItems);
          const savingsPercent = cartTotal > 0 ? (savingsAmount / cartTotal) * 100 : 0;
          
          // Generate message
          let message = "";
          let autoApplicable = false;
          
          if (coupon.restrictions.minimumPurchase && cartTotal < coupon.restrictions.minimumPurchase) {
            const diff = coupon.restrictions.minimumPurchase - cartTotal;
            message = `Add $${diff.toFixed(2)} more to unlock ${coupon.name}`;
          } else if (savingsAmount > 0) {
            message = `Save $${savingsAmount.toFixed(2)} with ${coupon.name}`;
            autoApplicable = true;
          } else if (coupon.type === "free_shipping") {
            message = `Get free shipping with ${coupon.name}`;
            autoApplicable = cartTotal < 150;
          }
          
          if (message) {
            suggestions.push({
              coupon,
              savingsAmount,
              savingsPercent,
              message,
              autoApplicable,
            });
          }
        }
        
        // Sort by savings amount
        return suggestions.sort((a, b) => b.savingsAmount - a.savingsAmount);
      },
      
      toggleCouponDrawer: () => {
        set((state) => ({ isCouponDrawerOpen: !state.isCouponDrawerOpen }));
      },
      
      setCouponInputValue: (value: string) => {
        set({ couponInputValue: value.toUpperCase() });
      },
      
      clearValidation: () => {
        set({ validationError: null, validationWarning: null });
      },
    }),
    {
      name: "diora-coupons",
      partialize: (state) => ({
        usedCoupons: state.usedCoupons,
      }),
    }
  )
);
