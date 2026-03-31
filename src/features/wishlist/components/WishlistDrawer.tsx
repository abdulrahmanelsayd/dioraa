"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, ShoppingBag, Heart, Trash2, Share2, Link2, Check, Mail, Sparkles, Copy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useWishlistStore } from "../store/useWishlistStore";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { Button } from "@/shared/ui";
import { formatPrice } from "@/shared/lib/utils";

// Social icons
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, x: -50, scale: 0.9 }
};

// Share Modal - High End & Responsive
function ShareModal({ isOpen, onClose, wishlistItems }: { isOpen: boolean; onClose: () => void; wishlistItems: any[] }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/wishlist/share` : "";
  const shareText = `Check out my DIORA wishlist with ${wishlistItems.length} luxury beauty items!`;
  const totalValue = wishlistItems.reduce((acc, item) => acc + item.price, 0);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareButtons = [
    { name: "WhatsApp", icon: <WhatsAppIcon />, color: "bg-green-500", url: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}` },
    { name: "X", icon: <TwitterIcon />, color: "bg-black", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
    { name: "Pinterest", icon: <PinterestIcon />, color: "bg-red-600", url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}` },
    { name: "Facebook", icon: <FacebookIcon />, color: "bg-blue-600", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { name: "Email", icon: <Mail className="w-5 h-5" />, color: "bg-brand-rose", url: `mailto:?subject=${encodeURIComponent("My DIORA Wishlist")}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}` },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full sm:w-auto sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Mobile drag handle */}
              <div className="sm:hidden w-full pt-3 pb-2 flex justify-center">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-blush/50 flex items-center justify-center">
                      <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-rose" />
                    </div>
                    <div>
                      <h3 className="font-serif text-base sm:text-lg text-brand-ink">Share Wishlist</h3>
                      <p className="text-[10px] sm:text-xs text-gray-500">{wishlistItems.length} items · {formatPrice(totalValue)}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Product Preview */}
              <div className="px-4 sm:px-5 py-3 bg-gray-50">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-sans">Preview</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {wishlistItems.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-brand-rose/20"
                    >
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                  ))}
                  {wishlistItems.length > 5 && (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-brand-blush/50 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] sm:text-xs font-medium">+{wishlistItems.length - 5}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Copy Link */}
              <div className="px-4 sm:px-5 py-3 sm:py-4">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-sans">Copy Link</p>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 sm:py-2.5 bg-gray-100 rounded-lg min-w-0">
                    <Link2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-600 truncate font-sans">{shareUrl.replace(/^https?:\/\//, "").slice(0, 25)}...</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs font-medium flex items-center gap-1.5 flex-shrink-0 transition-colors ${
                      copied ? "bg-green-500 text-white" : "bg-brand-ink text-white"
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Social Share */}
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 sm:mb-3 text-center font-sans">Share via</p>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {shareButtons.map((btn) => (
                    <a
                      key={btn.name}
                      href={btn.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex flex-col items-center gap-1 p-2 sm:p-2.5 rounded-xl ${btn.color} text-white hover:opacity-90 transition-opacity min-w-[50px] sm:min-w-[56px]`}
                    >
                      {btn.icon}
                      <span className="text-[9px] sm:text-[10px] font-sans font-medium">{btn.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export function WishlistDrawer() {
  const { items, isOpen, toggleWishlistDrawer, removeFromWishlist, moveToCart } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);
  const [shareOpen, setShareOpen] = useState(false);
  const totalValue = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Luxury Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleWishlistDrawer}
              className="fixed inset-0 z-50 bg-brand-ink/50 backdrop-blur-md"
            />

            {/* Luxury Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-gradient-to-b from-brand-offWhite via-white to-brand-blush/10 shadow-2xl flex flex-col border-l border-brand-rose/20"
            >
              {/* Luxury Header */}
              <div className="flex flex-col p-6 border-b border-brand-rose/20 bg-white/80 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-rose/20 to-brand-blush/40 flex items-center justify-center"
                    >
                      <Heart className="w-5 h-5 text-brand-rose" fill="currentColor" />
                    </motion.div>
                    <div>
                      <h2 className="font-serif text-2xl text-brand-ink tracking-tight">Your Wishlist</h2>
                      {items.length > 0 && (
                        <p className="text-xs text-brand-mist font-sans">
                          {items.length} {items.length === 1 ? "item" : "items"} saved
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={toggleWishlistDrawer}
                    className="p-2 text-brand-ink/60 hover:text-brand-ink hover:bg-brand-blush/30 rounded-full transition-all duration-300"
                    aria-label="Close wishlist"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Share Button */}
                {items.length > 0 && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => setShareOpen(true)}
                    className="mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-blush/30 hover:bg-brand-blush/50 rounded-full text-brand-ink text-xs font-sans uppercase tracking-wider transition-all"
                  >
                    <Share2 size={14} />
                    Share Your Wishlist
                  </motion.button>
                )}
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-blush/40 to-brand-rose/20 flex items-center justify-center mb-6"
                    >
                      <Heart className="w-10 h-10 text-brand-rose/60" />
                    </motion.div>
                    <p className="font-serif text-xl text-brand-ink mb-2">Your wishlist is empty</p>
                    <p className="font-sans text-sm text-brand-mist mb-6 max-w-xs">
                      Save your favorite products to find them easily later
                    </p>
                    <Link
                      href="/#bestsellers"
                      onClick={toggleWishlistDrawer}
                      className="inline-flex items-center justify-center px-8 py-3 bg-brand-ink text-brand-offWhite font-sans text-xs uppercase tracking-widest rounded-full hover:bg-brand-ink/90 transition-all duration-300 hover:shadow-lg hover:scale-105"
                    >
                      Explore Collection
                    </Link>
                  </div>
                ) : (
                  <div className="p-6 space-y-6">
                    <AnimatePresence mode="popLayout">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layout
                          transition={{ delay: index * 0.05, duration: 0.4 }}
                          className="flex gap-4 group"
                        >
                          <div className="relative w-24 h-32 bg-brand-blush/20 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-brand-rose/10">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                              <div className="flex justify-between items-start">
                                <Link
                                  href={`/product/${item.slug}`}
                                  onClick={toggleWishlistDrawer}
                                  className="font-serif font-medium text-brand-ink leading-tight pr-4 hover:text-brand-rose transition-colors"
                                >
                                  {item.name}
                                </Link>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => removeFromWishlist(item.id)}
                                  className="p-1.5 text-brand-ink/40 hover:text-brand-deepRose hover:bg-red-50 rounded-full transition-all"
                                >
                                  <Trash2 size={16} />
                                </motion.button>
                              </div>
                              <span className="text-[10px] uppercase tracking-widest text-brand-ink/60 mt-1 block">
                                {item.category}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <span className="font-mono text-sm font-semibold text-brand-ink">
                                {formatPrice(item.price)}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => moveToCart(item.id, addToCart)}
                                className="px-4 py-2 bg-brand-ink text-white text-xs font-sans rounded-full hover:bg-brand-deepRose transition-colors flex items-center gap-1.5 shadow-md"
                              >
                                <ShoppingBag size={14} />
                                Add to Bag
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="p-6 border-t border-brand-rose/20 bg-white/90 backdrop-blur-xl"
                >
                  {/* Total */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-sans uppercase tracking-widest text-sm text-brand-ink/80">
                      Total Value
                    </span>
                    <motion.span
                      key={totalValue}
                      initial={{ scale: 1.2, color: "#d4a5a5" }}
                      animate={{ scale: 1, color: "#1a1a2e" }}
                      className="font-serif text-2xl text-brand-ink"
                    >
                      {formatPrice(totalValue)}
                    </motion.span>
                  </div>

                  {/* Add All to Cart */}
                  <Button
                    size="lg"
                    className="w-full text-lg tracking-wide uppercase shadow-lg hover:shadow-xl transition-shadow"
                    onClick={() => {
                      items.forEach((item) => moveToCart(item.id, addToCart));
                      toggleWishlistDrawer();
                    }}
                  >
                    <ShoppingBag size={18} className="mr-2" />
                    Add All to Bag
                  </Button>

                  {/* Continue Shopping */}
                  <Link
                    href="/#bestsellers"
                    onClick={toggleWishlistDrawer}
                    className="block text-center text-xs text-brand-mist hover:text-brand-rose transition-colors mt-4 font-sans uppercase tracking-wider"
                  >
                    Continue Shopping
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} wishlistItems={items} />
    </>
  );
}
