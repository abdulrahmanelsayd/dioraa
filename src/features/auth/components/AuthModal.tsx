"use client";

import { useState, useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "../store/useAuthStore";
import { loginSchema, signupSchema, type SignupFormData } from "../schemas";

interface LoginFormInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: "login" | "signup";
}

export function AuthModal({ isOpen, onClose, defaultView = "login" }: AuthModalProps) {
  const [view, setView] = useState<"login" | "signup">(defaultView);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = useAuthStore((state) => state.login);
  const signup = useAuthStore((state) => state.signup);

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema) as Resolver<LoginFormInput>,
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    reset: resetSignup,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  const handleClose = () => {
    setGeneralError(null);
    setSuccessMessage(null);
    resetLogin();
    resetSignup();
    onClose();
  };

  const switchView = (newView: "login" | "signup") => {
    setView(newView);
    setGeneralError(null);
    setSuccessMessage(null);
  };

  const onLoginSubmit = async (data: LoginFormInput) => {
    setGeneralError(null);
    setIsSubmitting(true);
    try {
      const result = await login(data);
      if (result.success) {
        setSuccessMessage("Welcome back!");
        setTimeout(() => {
          handleClose();
        }, 800);
      } else {
        setGeneralError(result.error || "Login failed. Please try again.");
      }
    } catch {
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignupSubmit = async (data: SignupFormData) => {
    setGeneralError(null);
    setIsSubmitting(true);
    try {
      const result = await signup(data);
      if (result.success) {
        setSuccessMessage("Account created successfully!");
        setTimeout(() => {
          handleClose();
        }, 800);
      } else {
        setGeneralError(result.error || "Signup failed. Please try again.");
      }
    } catch {
      setGeneralError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100] bg-brand-ink/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md bg-brand-offWhite rounded-luxury shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-brand-ink/40 hover:text-brand-ink transition-colors z-10"
                aria-label="Close authentication modal"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div className="px-8 pt-8 pb-6 text-center">
                <h2 
                  id="auth-modal-title"
                  className="font-serif text-2xl text-brand-ink tracking-tight mb-2"
                >
                  {view === "login" ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="font-sans text-sm text-brand-slate">
                  {view === "login" 
                    ? "Sign in to access your account and orders" 
                    : "Join DIORA for exclusive offers and luxury experiences"}
                </p>
              </div>

              {/* Success Message */}
              <AnimatePresence>
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-8 mb-4"
                  >
                    <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-luxury text-sm">
                      <CheckCircle2 size={16} />
                      {successMessage}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* General Error */}
              <AnimatePresence>
                {generalError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-8 mb-4"
                    role="alert"
                  >
                    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-luxury text-sm">
                      <AlertCircle size={16} />
                      {generalError}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Form */}
              <AnimatePresence mode="wait">
                {view === "login" && (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleLoginSubmit(onLoginSubmit)}
                    className="px-8 pb-8 space-y-5"
                    noValidate
                  >
                    {/* Email Field */}
                    <div>
                      <label 
                        htmlFor="login-email" 
                        className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        {...registerLogin("email")}
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        aria-invalid={loginErrors.email ? "true" : "false"}
                        aria-describedby={loginErrors.email ? "login-email-error" : undefined}
                        className={cn(
                          "w-full px-4 py-3 bg-white border rounded-luxury text-sm font-sans text-brand-ink",
                          "placeholder:text-brand-mist",
                          "focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:border-brand-rose/50",
                          "transition-all duration-200",
                          loginErrors.email ? "border-red-300" : "border-brand-rose/20"
                        )}
                        placeholder="your@email.com"
                      />
                      {loginErrors.email && (
                        <p 
                          id="login-email-error" 
                          className="mt-1.5 text-xs text-red-500 flex items-center gap-1"
                          role="alert"
                        >
                          <AlertCircle size={12} />
                          {loginErrors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div>
                      <label 
                        htmlFor="login-password" 
                        className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          {...registerLogin("password")}
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          aria-invalid={loginErrors.password ? "true" : "false"}
                          aria-describedby={loginErrors.password ? "login-password-error" : undefined}
                          className={cn(
                            "w-full px-4 py-3 bg-white border rounded-luxury text-sm font-sans text-brand-ink",
                            "placeholder:text-brand-mist",
                            "focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:border-brand-rose/50",
                            "transition-all duration-200",
                            loginErrors.password ? "border-red-300" : "border-brand-rose/20"
                          )}
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brand-mist hover:text-brand-slate transition-colors"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {loginErrors.password && (
                        <p 
                          id="login-password-error" 
                          className="mt-1.5 text-xs text-red-500 flex items-center gap-1"
                          role="alert"
                        >
                          <AlertCircle size={12} />
                          {loginErrors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          {...registerLogin("rememberMe")}
                          type="checkbox"
                          className="w-4 h-4 rounded border-brand-rose/30 text-brand-rose focus:ring-brand-rose/30"
                        />
                        <span className="text-sm text-brand-slate">Remember me</span>
                      </label>
                      <button
                        type="button"
                        className="text-sm text-brand-rose hover:text-brand-deepRose transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "w-full py-3.5 bg-brand-ink text-brand-offWhite font-sans text-sm font-medium",
                        "uppercase tracking-widest rounded-full",
                        "hover:bg-brand-ink/90 active:scale-[0.98]",
                        "transition-all duration-200",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "flex items-center justify-center gap-2"
                      )}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </button>

                    {/* Switch to Signup */}
                    <p className="text-center text-sm text-brand-slate">
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => switchView("signup")}
                        className="text-brand-rose hover:text-brand-deepRose font-medium transition-colors"
                      >
                        Create one
                      </button>
                    </p>
                  </motion.form>
                )}

                {/* Signup Form */}
                {view === "signup" && (
                  <motion.form
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSignupSubmit(onSignupSubmit)}
                    className="px-8 pb-8 space-y-4"
                    noValidate
                  >
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label 
                          htmlFor="signup-firstName" 
                          className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2"
                        >
                          First Name
                        </label>
                        <input
                          {...registerSignup("firstName")}
                          id="signup-firstName"
                          type="text"
                          autoComplete="given-name"
                          aria-invalid={signupErrors.firstName ? "true" : "false"}
                          aria-describedby={signupErrors.firstName ? "signup-firstName-error" : undefined}
                          className={cn(
                            "w-full px-4 py-3 bg-white border rounded-luxury text-sm font-sans text-brand-ink",
                            "placeholder:text-brand-mist",
                            "focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:border-brand-rose/50",
                            "transition-all duration-200",
                            signupErrors.firstName ? "border-red-300" : "border-brand-rose/20"
                          )}
                          placeholder="Jane"
                        />
                        {signupErrors.firstName && (
                          <p 
                            id="signup-firstName-error" 
                            className="mt-1.5 text-xs text-red-500 flex items-center gap-1"
                            role="alert"
                          >
                            <AlertCircle size={12} />
                            {signupErrors.firstName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label 
                          htmlFor="signup-lastName" 
                          className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2"
                        >
                          Last Name
                        </label>
                        <input
                          {...registerSignup("lastName")}
                          id="signup-lastName"
                          type="text"
                          autoComplete="family-name"
                          aria-invalid={signupErrors.lastName ? "true" : "false"}
                          aria-describedby={signupErrors.lastName ? "signup-lastName-error" : undefined}
                          className={cn(
                            "w-full px-4 py-3 bg-white border rounded-luxury text-sm font-sans text-brand-ink",
                            "placeholder:text-brand-mist",
                            "focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:border-brand-rose/50",
                            "transition-all duration-200",
                            signupErrors.lastName ? "border-red-300" : "border-brand-rose/20"
                          )}
                          placeholder="Doe"
                        />
                        {signupErrors.lastName && (
                          <p 
                            id="signup-lastName-error" 
                            className="mt-1.5 text-xs text-red-500 flex items-center gap-1"
                            role="alert"
                          >
                            <AlertCircle size={12} />
                            {signupErrors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label 
                        htmlFor="signup-email" 
                        className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        {...registerSignup("email")}
                        id="signup-email"
                        type="email"
                        autoComplete="email"
                        aria-invalid={signupErrors.email ? "true" : "false"}
                        aria-describedby={signupErrors.email ? "signup-email-error" : undefined}
                        className={cn(
                          "w-full px-4 py-3 bg-white border rounded-luxury text-sm font-sans text-brand-ink",
                          "placeholder:text-brand-mist",
                          "focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:border-brand-rose/50",
                          "transition-all duration-200",
                          signupErrors.email ? "border-red-300" : "border-brand-rose/20"
                        )}
                        placeholder="your@email.com"
                      />
                      {signupErrors.email && (
                        <p 
                          id="signup-email-error" 
                          className="mt-1.5 text-xs text-red-500 flex items-center gap-1"
                          role="alert"
                        >
                          <AlertCircle size={12} />
                          {signupErrors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label 
                        htmlFor="signup-phone" 
                        className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2"
                      >
                        Phone <span className="text-brand-mist font-normal">(Optional)</span>
                      </label>
                      <input
                        {...registerSignup("phone")}
                        id="signup-phone"
                        type="tel"
                        autoComplete="tel"
                        aria-invalid={signupErrors.phone ? "true" : "false"}
                        aria-describedby={signupErrors.phone ? "signup-phone-error" : undefined}
                        className={cn(
                          "w-full px-4 py-3 bg-white border rounded-luxury text-sm font-sans text-brand-ink",
                          "placeholder:text-brand-mist",
                          "focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:border-brand-rose/50",
                          "transition-all duration-200",
                          signupErrors.phone ? "border-red-300" : "border-brand-rose/20"
                        )}
                        placeholder="+1 (555) 123-4567"
                      />
                      {signupErrors.phone && (
                        <p 
                          id="signup-phone-error" 
                          className="mt-1.5 text-xs text-red-500 flex items-center gap-1"
                          role="alert"
                        >
                          <AlertCircle size={12} />
                          {signupErrors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div>
                      <label 
                        htmlFor="signup-password" 
                        className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          {...registerSignup("password")}
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          aria-invalid={signupErrors.password ? "true" : "false"}
                          aria-describedby={signupErrors.password ? "signup-password-error" : "password-hint"}
                          className={cn(
                            "w-full px-4 py-3 bg-white border rounded-luxury text-sm font-sans text-brand-ink",
                            "placeholder:text-brand-mist",
                            "focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:border-brand-rose/50",
                            "transition-all duration-200",
                            signupErrors.password ? "border-red-300" : "border-brand-rose/20"
                          )}
                          placeholder="Create a strong password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brand-mist hover:text-brand-slate transition-colors"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <p id="password-hint" className="mt-1.5 text-xs text-brand-mist">
                        Min 8 characters, 1 uppercase, 1 number
                      </p>
                      {signupErrors.password && (
                        <p 
                          id="signup-password-error" 
                          className="mt-1.5 text-xs text-red-500 flex items-center gap-1"
                          role="alert"
                        >
                          <AlertCircle size={12} />
                          {signupErrors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                      <label 
                        htmlFor="signup-confirmPassword" 
                        className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          {...registerSignup("confirmPassword")}
                          id="signup-confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          aria-invalid={signupErrors.confirmPassword ? "true" : "false"}
                          aria-describedby={signupErrors.confirmPassword ? "signup-confirmPassword-error" : undefined}
                          className={cn(
                            "w-full px-4 py-3 bg-white border rounded-luxury text-sm font-sans text-brand-ink",
                            "placeholder:text-brand-mist",
                            "focus:outline-none focus:ring-2 focus:ring-brand-rose/30 focus:border-brand-rose/50",
                            "transition-all duration-200",
                            signupErrors.confirmPassword ? "border-red-300" : "border-brand-rose/20"
                          )}
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brand-mist hover:text-brand-slate transition-colors"
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {signupErrors.confirmPassword && (
                        <p 
                          id="signup-confirmPassword-error" 
                          className="mt-1.5 text-xs text-red-500 flex items-center gap-1"
                          role="alert"
                        >
                          <AlertCircle size={12} />
                          {signupErrors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "w-full py-3.5 bg-brand-ink text-brand-offWhite font-sans text-sm font-medium",
                        "uppercase tracking-widest rounded-full",
                        "hover:bg-brand-ink/90 active:scale-[0.98]",
                        "transition-all duration-200",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "flex items-center justify-center gap-2"
                      )}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>

                    {/* Switch to Login */}
                    <p className="text-center text-sm text-brand-slate">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => switchView("login")}
                        className="text-brand-rose hover:text-brand-deepRose font-medium transition-colors"
                      >
                        Sign in
                      </button>
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
