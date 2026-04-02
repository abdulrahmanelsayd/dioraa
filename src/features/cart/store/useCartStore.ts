import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/shared/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  lastAddedItem: CartItem | null; // For toast notification
  autoOpenCart: boolean; // User preference
  addItem: (product: Product, quantity?: number, selectedVariantId?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setAutoOpenCart: (value: boolean) => void;
  clearLastAddedItem: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastAddedItem: null,
      autoOpenCart: false, // Default to false - use toast instead
      addItem: (product, quantity = 1, selectedVariantId) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.id === product.id && item.selectedVariantId === selectedVariantId
        );

        // Payload representing what was JUST added (for toast notification)
        const lastAddedPayload: CartItem = { 
          ...product, 
          quantity,  // The quantity being added in THIS action
          selectedVariantId 
        };

        if (existingItem) {
          // Update existing item: add new quantity to existing
          const updatedItems = currentItems.map((item) =>
            item.id === product.id && item.selectedVariantId === selectedVariantId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          set({
            items: updatedItems,
            lastAddedItem: lastAddedPayload,  // Show what was just added (e.g., "Added 3")
            isOpen: get().autoOpenCart,
          });
        } else {
          // Add new item with specified quantity
          set({ 
            items: [...currentItems, lastAddedPayload], 
            lastAddedItem: lastAddedPayload,
            isOpen: get().autoOpenCart,
          });
        }
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ items: [], lastAddedItem: null }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setAutoOpenCart: (value) => set({ autoOpenCart: value }),
      clearLastAddedItem: () => set({ lastAddedItem: null }),
    }),
    {
      name: "diora-cart-storage",
      partialize: (state) => ({
        items: state.items,
        autoOpenCart: state.autoOpenCart,
      }),
    }
  )
);
