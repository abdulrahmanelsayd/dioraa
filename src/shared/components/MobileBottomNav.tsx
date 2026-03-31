"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  Home, 
  Search, 
  ShoppingBag, 
  Heart, 
  Sparkles,
  Menu
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { useWishlistStore } from "@/features/wishlist/store/useWishlistStore";

interface NavItem {
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
}

// Glass morphism floating dock item
function DockItem({ 
  item, 
  isActive, 
  onClick,
  index 
}: { 
  item: NavItem; 
  isActive: boolean; 
  onClick: () => void;
  index: number;
}) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <Link 
        href={item.href}
        onClick={(e) => {
          onClick();
        }}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
      >
        <motion.div
          animate={{
            scale: isActive ? 1.1 : isPressed ? 0.9 : 1,
            y: isActive ? -8 : 0,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={cn(
            "relative flex flex-col items-center justify-center p-3 rounded-2xl",
            "w-14 h-14 sm:w-16 sm:h-16",
            "transition-all duration-300",
            isActive 
              ? "bg-white shadow-[0_8px_30px_rgba(212,165,165,0.4)]"
              : "hover:bg-white/50"
          )}
        >
          {/* Icon */}
          <motion.div
            animate={{ 
              scale: isActive ? 1 : 1,
              color: isActive ? "#d4a5a5" : "#6b7280"
            }}
            className={cn(
              "transition-colors duration-300",
              isActive ? "text-brand-rose" : "text-brand-mist"
            )}
          >
            {isActive ? item.activeIcon : item.icon}
          </motion.div>

          {/* Active indicator pill */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute -bottom-1 w-1 h-1 rounded-full bg-brand-rose"
              />
            )}
          </AnimatePresence>

          {/* Glow effect when active */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-rose/10 via-transparent to-brand-blush/20 -z-10"
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Label */}
        <motion.span
          animate={{ 
            opacity: isActive ? 1 : 0.7,
            y: isActive ? 0 : 2
          }}
          className={cn(
            "text-[10px] font-sans font-medium mt-1 text-center",
            isActive ? "text-brand-ink" : "text-brand-mist"
          )}
        >
          {item.label}
        </motion.span>

        {/* Badge */}
        {item.badge && item.badge > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-rose text-white text-[10px] font-sans font-bold flex items-center justify-center shadow-lg"
          >
            {item.badge > 99 ? "99+" : item.badge}
          </motion.span>
        )}
      </Link>
    </motion.div>
  );
}

// Center floating action button (like iOS Dynamic Island style)
function CenterButton({ onClick, isMenuOpen }: { onClick: () => void; isMenuOpen: boolean }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        rotate: isMenuOpen ? 45 : 0,
      }}
      className={cn(
        "relative flex items-center justify-center",
        "w-14 h-14 rounded-full",
        "bg-gradient-to-br from-brand-ink via-brand-ink to-brand-deepRose",
        "shadow-[0_8px_30px_rgba(26,26,46,0.4)]",
        "hover:shadow-[0_12px_40px_rgba(26,26,46,0.5)]",
        "transition-shadow duration-300",
        "-mt-6"
      )}
    >
      {/* Inner gradient */}
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-brand-rose/20 to-transparent" />
      
      {/* Icon */}
      <motion.div
        animate={{ rotate: isMenuOpen ? -45 : 0 }}
        className="relative z-10 text-white"
      >
        <Sparkles size={22} />
      </motion.div>

      {/* Pulse animation */}
      <motion.div
        className="absolute inset-0 rounded-full bg-brand-rose/30"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.button>
  );
}

// Quick menu for center button
function QuickMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const quickActions = [
    { label: "New Arrivals", href: "/category/skin-care?filter=new", icon: "✨" },
    { label: "Bestsellers", href: "/#bestsellers", icon: "🔥" },
    { label: "Sale", href: "/category/skin-care?filter=sale", icon: "%" },
    { label: "Search", href: "#", icon: "🔍", onClick: () => {} },
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
            className="fixed inset-0 z-40 bg-brand-ink/30 backdrop-blur-sm"
          />

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3"
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={action.href} onClick={onClose}>
                  <motion.div
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-xl rounded-full shadow-lg border border-brand-rose/10"
                  >
                    <span className="text-lg">{action.icon}</span>
                    <span className="text-sm font-sans text-brand-ink">{action.label}</span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  // Handle scroll behavior - hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show at top or bottom of page, hide when scrolling down
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        if (currentScrollY + windowHeight < documentHeight - 100) {
          setIsVisible(false);
          setMenuOpen(false);
        }
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Set active item based on pathname
  useEffect(() => {
    if (pathname === "/") setActiveItem("home");
    else if (pathname.includes("/category")) setActiveItem("shop");
    else if (pathname.includes("/product")) setActiveItem("shop");
    else if (pathname === "#search") setActiveItem("search");
    else if (pathname === "/wishlist") setActiveItem("wishlist");
    else if (pathname === "/cart") setActiveItem("cart");
  }, [pathname]);

  const navItems: NavItem[] = [
    {
      icon: <Home size={22} strokeWidth={1.5} />,
      activeIcon: <Home size={22} strokeWidth={2} />,
      label: "Home",
      href: "/",
    },
    {
      icon: <Search size={22} strokeWidth={1.5} />,
      activeIcon: <Search size={22} strokeWidth={2} />,
      label: "Search",
      href: "#search",
    },
    {
      icon: <ShoppingBag size={22} strokeWidth={1.5} />,
      activeIcon: <ShoppingBag size={22} strokeWidth={2} />,
      label: "Cart",
      href: "#cart",
      badge: cartCount,
    },
    {
      icon: <Heart size={22} strokeWidth={1.5} />,
      activeIcon: <Heart size={22} strokeWidth={2} fill="currentColor" />,
      label: "Saved",
      href: "#wishlist",
      badge: wishlistCount,
    },
  ];

  // Handle special actions
  const handleNavClick = (item: NavItem) => {
    if (item.href === "#cart") {
      const toggleCart = useCartStore.getState().toggleCart;
      toggleCart();
      return;
    }
    if (item.href === "#wishlist") {
      const toggleWishlist = useWishlistStore.getState().toggleWishlistDrawer;
      toggleWishlist();
      return;
    }
  };

  return (
    <>
      {/* Quick Menu Overlay */}
      <QuickMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Bottom Navigation */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ 
          y: isVisible ? 0 : 100,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50",
          "md:hidden",
          "pb-safe"
        )}
      >
        {/* Glass morphism container */}
        <div className="mx-4 mb-4">
          <motion.div
            className={cn(
              "relative flex items-center justify-around",
              "px-2 py-3 rounded-3xl",
              "bg-white/80 backdrop-blur-xl",
              "border border-white/40",
              "shadow-[0_8px_32px_rgba(212,165,165,0.2),0_-4px_20px_rgba(255,255,255,0.5)]"
            )}
          >
            {/* Left items (3 items) */}
            <div className="flex items-end gap-1">
              {navItems.slice(0, 2).map((item, index) => (
                <DockItem
                  key={item.label}
                  item={item}
                  isActive={activeItem === item.label.toLowerCase()}
                  onClick={() => {
                    if (item.href.startsWith("#")) {
                      handleNavClick(item);
                    }
                  }}
                  index={index}
                />
              ))}
            </div>

            {/* Center Button */}
            <div className="relative">
              <CenterButton 
                onClick={() => setMenuOpen(!menuOpen)} 
                isMenuOpen={menuOpen}
              />
            </div>

            {/* Right items (3 items) */}
            <div className="flex items-end gap-1">
              {navItems.slice(2, 4).map((item, index) => (
                <DockItem
                  key={item.label}
                  item={item}
                  isActive={activeItem === item.label.toLowerCase()}
                  onClick={() => {
                    if (item.href.startsWith("#")) {
                      handleNavClick(item);
                    }
                  }}
                  index={index + 2}
                />
              ))}
            </div>

            {/* Glossy highlight effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/50 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </motion.div>

      {/* Safe area spacer for iOS */}
      <div className="h-safe-area-inset-bottom md:hidden" />
    </>
  );
}
