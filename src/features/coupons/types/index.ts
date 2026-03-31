export type CouponType = 
  | "percentage" 
  | "fixed" 
  | "free_shipping" 
  | "buy_x_get_y"
  | "tiered";

export type CouponStatus = "active" | "expired" | "used" | "upcoming";

export interface CouponRestrictions {
  minimumPurchase?: number;
  maximumDiscount?: number;
  applicableCategories?: string[];
  excludedProducts?: string[];
  firstTimeOnly?: boolean;
  maxUses?: number;
  currentUses?: number;
}

export interface CouponTier {
  minPurchase: number;
  discount: number;
  type: "percentage" | "fixed";
}

export interface BuyXGetYConfig {
  buyQuantity: number;
  getQuantity: number;
  discountPercent: number;
  applicableProducts?: string[];
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  type: CouponType;
  value: number;
  status: CouponStatus;
  restrictions: CouponRestrictions;
  
  // For tiered coupons
  tiers?: CouponTier[];
  
  // For buy X get Y coupons
  buyXGetY?: BuyXGetYConfig;
  
  // Visual elements
  badge?: string;
  gradient?: string;
  icon?: "sparkles" | "gift" | "truck" | "percent" | "crown";
  
  // Dates
  validFrom: Date;
  validUntil: Date;
  createdAt: Date;
  
  // Tracking
  timesUsed: number;
  maxUsesPerUser: number;
}

export interface AppliedCoupon {
  coupon: Coupon;
  discountAmount: number;
  appliedAt: Date;
  discountBreakdown?: {
    items: string[];
    originalTotal: number;
    discountPerItem: number[];
  };
}

export interface CouponValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
  estimatedDiscount?: number;
}

export interface CouponSuggestion {
  coupon: Coupon;
  savingsAmount: number;
  savingsPercent: number;
  message: string;
  autoApplicable: boolean;
}
