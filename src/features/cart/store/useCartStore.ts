import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/shared/types";

interface CartState {
  items: CartItem[];
  savedItems: CartItem[]; // Saved for later
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
  // Save for later actions
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeSavedItem: (productId: string) => void;
  moveAllToCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedItems: [],
      isOpen: false,
      lastAddedItem: null,
      autoOpenCart: false, // Default to false - use toast instead
      addItem: (product, quantity = 1, selectedVariantId) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.id === product.id && item.selectedVariantId === selectedVariantId
        );

        const newItem: CartItem = { 
          ...product, 
          quantity, 
          selectedVariantId 
        };

        if (existingItem) {
          const updatedItems = currentItems.map((item) =>
            item.id === product.id && item.selectedVariantId === selectedVariantId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          set({
            items: updatedItems,
            lastAddedItem: newItem,
            isOpen: get().autoOpenCart, // Only open if user preference is set
          });
        } else {
          set({ 
            items: [...currentItems, newItem], 
            lastAddedItem: newItem,
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
      clearCart: () => set({ items: [], savedItems: [], lastAddedItem: null }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setAutoOpenCart: (value) => set({ autoOpenCart: value }),
      clearLastAddedItem: () => set({ lastAddedItem: null }),

      // Save for Later - Luxury Feature
      saveForLater: (productId: string) => {
        const item = get().items.find((i) => i.id === productId);
        if (item) {
          set({
            items: get().items.filter((i) => i.id !== productId),
            savedItems: [...get().savedItems, item],
          });
        }
      },

      moveToCart: (productId: string) => {
        const item = get().savedItems.find((i) => i.id === productId);
        if (item) {
          const existingItem = get().items.find((i) => i.id === productId);
          if (existingItem) {
            set({
              savedItems: get().savedItems.filter((i) => i.id !== productId),
              items: get().items.map((i) =>
                i.id === productId ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            });
          } else {
            set({
              savedItems: get().savedItems.filter((i) => i.id !== productId),
              items: [...get().items, item],
            });
          }
        }
      },

      removeSavedItem: (productId: string) => {
        set({
          savedItems: get().savedItems.filter((i) => i.id !== productId),
        });
      },

      moveAllToCart: () => {
        const { savedItems, items } = get();
        const mergedItems = [...items];
        
        savedItems.forEach((savedItem) => {
          const existingIndex = mergedItems.findIndex((i) => i.id === savedItem.id);
          if (existingIndex >= 0) {
            mergedItems[existingIndex].quantity += savedItem.quantity;
          } else {
            mergedItems.push(savedItem);
          }
        });
        
        set({
          items: mergedItems,
          savedItems: [],
        });
      },
    }),
    {
      name: "diora-cart-storage",
      partialize: (state) => ({
        items: state.items,
        savedItems: state.savedItems,
        autoOpenCart: state.autoOpenCart,
      }),
    }
  )
);
