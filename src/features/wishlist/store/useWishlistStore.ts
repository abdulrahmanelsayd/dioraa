import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/shared/types";

interface WishlistState {
  items: Product[];
  isOpen: boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  toggleWishlistDrawer: () => void;
  clearWishlist: () => void;
  moveToCart: (productId: string, addToCart: (product: Product, quantity?: number) => void) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addToWishlist: (product: Product) => {
        const currentItems = get().items;
        const exists = currentItems.find((item) => item.id === product.id);
        if (!exists) {
          set({ items: [...currentItems, product] });
        }
      },

      removeFromWishlist: (productId: string) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.id === productId);
      },

      toggleWishlist: (product: Product) => {
        const isInWishlist = get().isInWishlist(product.id);
        if (isInWishlist) {
          get().removeFromWishlist(product.id);
        } else {
          get().addToWishlist(product);
        }
      },

      toggleWishlistDrawer: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      moveToCart: (productId: string, addToCart) => {
        const product = get().items.find((item) => item.id === productId);
        if (product) {
          addToCart(product, 1);
          get().removeFromWishlist(productId);
        }
      },
    }),
    {
      name: "diora-wishlist-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
