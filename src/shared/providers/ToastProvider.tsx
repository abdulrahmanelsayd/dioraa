"use client";

import { create } from "zustand";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Check, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { formatPrice } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";
import { useCartStore } from "@/features/cart/store/useCartStore";

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message?: string;
  productImage?: string;
  productName?: string;
  productPrice?: number;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    // Auto remove after duration
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, toast.duration || 4000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const showToast = (toast: Omit<Toast, "id">) => {
  useToastStore.getState().addToast(toast);
};

// Cart toast helper
export const showCartToast = (props: {
  productName: string;
  productImage: string;
  productPrice: number;
  quantity: number;
  onViewCart: () => void;
}) => {
  showToast({
    type: "success",
    title: "Added to Bag",
    message: `${props.quantity} × ${props.productName}`,
    productImage: props.productImage,
    productName: props.productName,
    productPrice: props.productPrice,
    duration: 5000,
    action: {
      label: "View Bag",
      onClick: props.onViewCart,
    },
  });
};

// Toast Provider Component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useToastStore();
  const { lastAddedItem, clearLastAddedItem, toggleCart } = useCartStore();

  // Watch for cart additions and show toast
  useEffect(() => {
    if (lastAddedItem) {
      showCartToast({
        productName: lastAddedItem.name,
        productImage: lastAddedItem.image,
        productPrice: lastAddedItem.price,
        quantity: lastAddedItem.quantity,
        onViewCart: () => {
          toggleCart();
        },
      });
      clearLastAddedItem();
    }
  }, [lastAddedItem, clearLastAddedItem, toggleCart]);

  return (
    <>
      {children}
      {/* Toast Container - Top Right for desktop, Bottom for mobile */}
      <div className="fixed top-4 right-4 z-[100] hidden md:flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
      {/* Mobile Toast Container - Bottom center */}
      <div className="fixed bottom-24 left-4 right-4 z-[100] flex md:hidden flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const Icon = toast.type === "success" ? Check : toast.type === "error" ? AlertCircle : ShoppingBag;
  const iconColor = toast.type === "success" ? "text-emerald-500" : toast.type === "error" ? "text-brand-rose" : "text-brand-ink";
  const borderColor = toast.type === "success" ? "border-emerald-200" : toast.type === "error" ? "border-brand-rose/30" : "border-brand-petal";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={`pointer-events-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border ${borderColor} overflow-hidden`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon or Product Image */}
          {toast.productImage ? (
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-brand-blush/30 flex-shrink-0">
              <Image
                src={toast.productImage}
                alt={toast.productName || ""}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className={`p-2 rounded-full bg-brand-offWhite ${iconColor}`}>
              <Icon size={18} />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-brand-ink text-sm">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-brand-slate mt-0.5">{toast.message}</p>
                )}
                {toast.productPrice && (
                  <p className="text-sm font-medium text-brand-ink mt-1">
                    {formatPrice(toast.productPrice)}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-brand-blush/30 transition-colors text-brand-mist hover:text-brand-ink"
              >
                <X size={14} />
              </button>
            </div>

            {/* Action Button */}
            {toast.action && (
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs h-8"
                  onClick={() => {
                    toast.action?.onClick();
                    onClose();
                  }}
                >
                  {toast.action.label}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: (toast.duration || 4000) / 1000, ease: "linear" }}
        className={`h-0.5 origin-left ${
          toast.type === "success" ? "bg-emerald-400" : toast.type === "error" ? "bg-brand-rose" : "bg-brand-ink"
        }`}
      />
    </motion.div>
  );
}
