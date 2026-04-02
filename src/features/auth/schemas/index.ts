/**
 * Auth Validation Schemas - Zod schemas for form validation
 */

import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(false),
});

export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters")
      .regex(/^[a-zA-Z\s'-]+$/, "First name contains invalid characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .regex(/^[a-zA-Z\s'-]+$/, "Last name contains invalid characters"),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(val),
        "Please enter a valid phone number"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const addressSchema = z.object({
  label: z
    .string()
    .min(1, "Address label is required")
    .max(20, "Label must be 20 characters or less"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  address1: z
    .string()
    .min(1, "Street address is required")
    .min(5, "Please enter a valid street address"),
  address2: z.string().optional(),
  city: z
    .string()
    .min(1, "City is required")
    .min(2, "Please enter a valid city name"),
  state: z
    .string()
    .min(1, "State/Province is required")
    .min(2, "Please enter a valid state/province"),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .regex(/^[A-Za-z0-9\s-]+$/, "Please enter a valid postal code"),
  country: z.string().min(1, "Country is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "Please enter a valid phone number"
    ),
  isDefault: z.boolean().default(false),
});

export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(val),
      "Please enter a valid phone number"
    ),
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 8,
      "New password must be at least 8 characters"
    )
    .refine(
      (val) =>
        !val || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val),
      "New password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmNewPassword: z.string().optional(),
}).refine(
  (data) => {
    if (data.newPassword && !data.currentPassword) {
      return false;
    }
    if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
      return false;
    }
    return true;
  },
  {
    message: "Passwords do not match or current password is required",
    path: ["confirmNewPassword"],
  }
);

// Checkout schemas
export const checkoutContactSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "Please enter a valid phone number"
    ),
  marketingConsent: z.boolean().optional().default(false),
});

export const checkoutShippingSchema = addressSchema
  .omit({ label: true, isDefault: true, country: true, postalCode: true, phone: true })
  .extend({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(
        /^[\+]?[0-9\s\-\(\)\.]{7,20}$/,
        "Please enter a valid phone number with country code if applicable"
      ),
  });

export const checkoutPaymentSchema = z.object({
  cardNumber: z
    .string()
    .min(1, "Card number is required")
    .regex(/^[\d\s]{16,19}$/, "Please enter a valid card number"),
  cardHolder: z
    .string()
    .min(1, "Cardholder name is required")
    .min(3, "Please enter the full name as shown on card"),
  expiryDate: z
    .string()
    .min(1, "Expiry date is required")
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Please enter expiry date as MM/YY"),
  cvv: z
    .string()
    .min(1, "CVV is required")
    .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
  saveCard: z.boolean().optional().default(false),
});

export type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type AddressFormData = {
  label: string;
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  address2?: string;
};

export type SignupFormData = z.infer<typeof signupSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type CheckoutContactFormData = z.infer<typeof checkoutContactSchema>;
export type CheckoutShippingFormData = z.infer<typeof checkoutShippingSchema>;
export type CheckoutPaymentFormData = z.infer<typeof checkoutPaymentSchema>;
