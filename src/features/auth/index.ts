// Auth Feature Exports
export { AuthModal } from "./components/AuthModal";
export { useAuthStore } from "./store/useAuthStore";
export type { 
  User, 
  Address, 
  Order, 
  OrderItem, 
  LoginCredentials, 
  SignupData,
  AuthState,
  AuthError
} from "./types";
export {
  loginSchema,
  signupSchema,
  addressSchema,
  profileUpdateSchema,
  checkoutContactSchema,
  checkoutShippingSchema,
  checkoutPaymentSchema,
  type LoginFormData,
  type SignupFormData,
  type AddressFormData,
  type ProfileUpdateFormData,
  type CheckoutContactFormData,
  type CheckoutShippingFormData,
  type CheckoutPaymentFormData,
} from "./schemas";
