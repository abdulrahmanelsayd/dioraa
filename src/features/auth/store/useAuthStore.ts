/**
 * Auth Store - User authentication state management
 * SECURITY: Uses PBKDF2 password hashing - never stores plain text passwords
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Address, Order, LoginCredentials, SignupData } from "../types";
import { hashPassword, verifyPassword, isRateLimited } from "@/shared/lib/security";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  addresses: Address[];
  orders: Order[];
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  addAddress: (address: Omit<Address, "id" | "userId">) => Promise<{ success: boolean; error?: string }>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<{ success: boolean; error?: string }>;
  deleteAddress: (id: string) => Promise<{ success: boolean; error?: string }>;
  setDefaultAddress: (id: string) => void;
  getDefaultAddress: () => Address | null;
  getAddressById: (id: string) => Address | null;
}

// Mock users database (in production, this would be Supabase)
// SECURITY: passwordHash stores PBKDF2 hashed password, never plain text
const mockUsers: Map<string, { user: User; passwordHash: string }> = new Map();
let mockAddresses: Address[] = [];
let mockOrders: Order[] = [];

// Generate mock order data for demo
const generateMockOrders = (userId: string): Order[] => [
  {
    id: "ord_1",
    userId,
    orderNumber: "DI-2024-001",
    status: "delivered",
    items: [
      {
        productId: "p_1",
        name: "Luminous Rose Serum",
        price: 120,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=200&auto=format&fit=crop",
      },
      {
        productId: "p_2",
        name: "Velvet Night Cream",
        price: 95,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=200&auto=format&fit=crop",
      },
    ],
    subtotal: 310,
    shipping: 15,
    tax: 25.5,
    total: 350.5,
    shippingAddress: {
      id: "addr_1",
      userId,
      label: "Home",
      firstName: "Jane",
      lastName: "Doe",
      address1: "123 Luxury Lane",
      city: "Beverly Hills",
      state: "CA",
      postalCode: "90210",
      country: "USA",
      phone: "+1 (555) 123-4567",
      isDefault: true,
    },
    billingAddress: {
      id: "addr_1",
      userId,
      label: "Home",
      firstName: "Jane",
      lastName: "Doe",
      address1: "123 Luxury Lane",
      city: "Beverly Hills",
      state: "CA",
      postalCode: "90210",
      country: "USA",
      phone: "+1 (555) 123-4567",
      isDefault: true,
    },
    paymentMethod: "Card ending in 4242",
    createdAt: "2024-12-15T10:30:00Z",
    updatedAt: "2024-12-18T14:20:00Z",
    trackingNumber: "TRK123456789",
  },
  {
    id: "ord_2",
    userId,
    orderNumber: "DI-2025-042",
    status: "shipped",
    items: [
      {
        productId: "p_5",
        name: "Golden Glow Face Oil",
        price: 135,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=200&auto=format&fit=crop",
      },
    ],
    subtotal: 135,
    shipping: 0,
    tax: 11.15,
    total: 146.15,
    shippingAddress: {
      id: "addr_1",
      userId,
      label: "Home",
      firstName: "Jane",
      lastName: "Doe",
      address1: "123 Luxury Lane",
      city: "Beverly Hills",
      state: "CA",
      postalCode: "90210",
      country: "USA",
      phone: "+1 (555) 123-4567",
      isDefault: true,
    },
    billingAddress: {
      id: "addr_1",
      userId,
      label: "Home",
      firstName: "Jane",
      lastName: "Doe",
      address1: "123 Luxury Lane",
      city: "Beverly Hills",
      state: "CA",
      postalCode: "90210",
      country: "USA",
      phone: "+1 (555) 123-4567",
      isDefault: true,
    },
    paymentMethod: "Card ending in 4242",
    createdAt: "2025-03-20T09:15:00Z",
    updatedAt: "2025-03-21T16:45:00Z",
    trackingNumber: "TRK987654321",
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      addresses: [],
      orders: [],

      login: async (credentials) => {
        // SECURITY: Rate limiting to prevent brute force attacks
        const rateLimit = isRateLimited("login", credentials.email);
        if (rateLimit.limited) {
          const waitSeconds = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
          return { 
            success: false, 
            error: `Too many login attempts. Please try again in ${waitSeconds} seconds.` 
          };
        }

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const userData = mockUsers.get(credentials.email);
        
        // SECURITY: Verify hashed password using PBKDF2
        if (!userData) {
          return { success: false, error: "Invalid email or password" };
        }
        
        const isValidPassword = await verifyPassword(credentials.password, userData.passwordHash);
        if (!isValidPassword) {
          return { success: false, error: "Invalid email or password" };
        }

        const { user } = userData;
        const userAddresses = mockAddresses.filter((a) => a.userId === user.id);
        const userOrders = mockOrders.filter((o) => o.userId === user.id);
        
        // If no orders yet, add mock orders for demo
        let ordersToSet = userOrders;
        if (userOrders.length === 0) {
          const newMockOrders = generateMockOrders(user.id);
          mockOrders = [...mockOrders, ...newMockOrders];
          ordersToSet = newMockOrders;
        }

        set({
          user,
          isAuthenticated: true,
          addresses: userAddresses,
          orders: ordersToSet,
        });

        return { success: true };
      },

      signup: async (data) => {
        // SECURITY: Rate limiting to prevent automated account creation
        const rateLimit = isRateLimited("signup", data.email);
        if (rateLimit.limited) {
          const waitMinutes = Math.ceil((rateLimit.resetTime - Date.now()) / 60000);
          return { 
            success: false, 
            error: `Too many signup attempts. Please try again in ${waitMinutes} minutes.` 
          };
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (mockUsers.has(data.email)) {
          return { success: false, error: "An account with this email already exists" };
        }

        const newUser: User = {
          id: `user_${Date.now()}`,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone || undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // SECURITY: Hash password with PBKDF2 before storing
        const passwordHash = await hashPassword(data.password);
        mockUsers.set(data.email, { user: newUser, passwordHash });

        set({
          user: newUser,
          isAuthenticated: true,
          addresses: [],
          orders: [],
        });

        return { success: true };
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          addresses: [],
          orders: [],
        });
      },

      updateProfile: async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 600));

        const { user } = get();
        if (!user) {
          return { success: false, error: "Not authenticated" };
        }

        const updatedUser = {
          ...user,
          ...data,
          updatedAt: new Date().toISOString(),
        };

        // Update in mock database
        const userEntry = mockUsers.get(user.email);
        if (userEntry) {
          userEntry.user = updatedUser;
        }

        set({ user: updatedUser });
        return { success: true };
      },

      addAddress: async (addressData) => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const { user, addresses } = get();
        if (!user) {
          return { success: false, error: "Not authenticated" };
        }

        const newAddress: Address = {
          ...addressData,
          id: `addr_${Date.now()}`,
          userId: user.id,
        };

        // If this is the first address or marked as default, update other addresses
        let updatedAddresses = [...addresses, newAddress];
        if (newAddress.isDefault || addresses.length === 0) {
          updatedAddresses = updatedAddresses.map((a) => ({
            ...a,
            isDefault: a.id === newAddress.id,
          }));
        }

        mockAddresses = [...mockAddresses, newAddress];
        set({ addresses: updatedAddresses });

        return { success: true };
      },

      updateAddress: async (id, addressData) => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const { user, addresses } = get();
        if (!user) {
          return { success: false, error: "Not authenticated" };
        }

        const updatedAddresses = addresses.map((a) =>
          a.id === id ? { ...a, ...addressData } : a
        );

        // Handle default address logic
        const updatedAddress = updatedAddresses.find((a) => a.id === id);
        if (updatedAddress?.isDefault) {
          updatedAddresses.forEach((a) => {
            if (a.id !== id) a.isDefault = false;
          });
        }

        mockAddresses = mockAddresses.map((a) =>
          a.id === id ? { ...a, ...addressData } : a
        );

        set({ addresses: updatedAddresses });
        return { success: true };
      },

      deleteAddress: async (id) => {
        await new Promise((resolve) => setTimeout(resolve, 400));

        const { user, addresses } = get();
        if (!user) {
          return { success: false, error: "Not authenticated" };
        }

        const updatedAddresses = addresses.filter((a) => a.id !== id);
        mockAddresses = mockAddresses.filter((a) => a.id !== id);

        set({ addresses: updatedAddresses });
        return { success: true };
      },

      setDefaultAddress: (id) => {
        const { addresses } = get();
        const updatedAddresses = addresses.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }));

        mockAddresses = mockAddresses.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }));

        set({ addresses: updatedAddresses });
      },

      getDefaultAddress: () => {
        const { addresses } = get();
        return addresses.find((a) => a.isDefault) || addresses[0] || null;
      },

      getAddressById: (id) => {
        const { addresses } = get();
        return addresses.find((a) => a.id === id) || null;
      },
    }),
    {
      name: "diora-auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        addresses: state.addresses,
        orders: state.orders,
      }),
    }
  )
);
