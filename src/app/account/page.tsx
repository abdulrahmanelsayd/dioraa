"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Package, 
  MapPin, 
  LogOut, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Star
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { profileUpdateSchema, addressSchema, type ProfileUpdateFormData, type AddressFormData } from "@/features/auth/schemas";
import type { Address, Order } from "@/features/auth/types";
import Link from "next/link";
import Image from "next/image";

type Tab = "profile" | "orders" | "addresses";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addresses = useAuthStore((state) => state.addresses);
  const orders = useAuthStore((state) => state.orders);
  const logout = useAuthStore((state) => state.logout);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const addAddress = useAuthStore((state) => state.addAddress);
  const updateAddress = useAuthStore((state) => state.updateAddress);
  const deleteAddress = useAuthStore((state) => state.deleteAddress);
  const setDefaultAddress = useAuthStore((state) => state.setDefaultAddress);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
    reset: resetProfile,
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const {
    register: registerAddress,
    handleSubmit: handleAddressSubmit,
    formState: { errors: addressErrors, isSubmitting: isAddressSubmitting },
    reset: resetAddress,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema) as Resolver<AddressFormData>,
    defaultValues: {
      label: "",
      firstName: "",
      lastName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "USA",
      phone: "",
      isDefault: false,
    },
  });

  const onProfileSubmit = async (data: ProfileUpdateFormData) => {
    setProfileSuccess(null);
    setProfileError(null);
    
    const result = await updateProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    });

    if (result.success) {
      setProfileSuccess("Profile updated successfully");
      setIsEditingProfile(false);
      setTimeout(() => setProfileSuccess(null), 3000);
    } else {
      setProfileError(result.error || "Failed to update profile");
    }
  };

  const onAddressSubmit = async (data: AddressFormData) => {
    if (editingAddressId) {
      const result = await updateAddress(editingAddressId, data);
      if (result.success) {
        setIsAddingAddress(false);
        setEditingAddressId(null);
        resetAddress();
      }
    } else {
      const result = await addAddress(data);
      if (result.success) {
        setIsAddingAddress(false);
        resetAddress();
      }
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddressId(address.id);
    resetAddress({
      label: address.label,
      firstName: address.firstName,
      lastName: address.lastName,
      address1: address.address1,
      address2: address.address2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setIsAddingAddress(true);
  };

  const handleDeleteAddress = async (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      await deleteAddress(id);
    }
  };

  const handleCancelAddress = () => {
    setIsAddingAddress(false);
    setEditingAddressId(null);
    resetAddress();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-offWhite flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-brand-ink mb-4">Please Sign In</h1>
          <p className="text-brand-slate mb-6">Sign in to access your account and orders</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-ink text-brand-offWhite rounded-full font-sans text-sm uppercase tracking-widest hover:bg-brand-ink/90 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "profile" as Tab, label: "Profile", icon: User },
    { id: "orders" as Tab, label: "Order History", icon: Package },
    { id: "addresses" as Tab, label: "Addresses", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-brand-offWhite">
      {/* Header */}
      <div className="bg-brand-ink text-brand-offWhite py-12">
        <div className="section-padding max-w-6xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl mb-2">My Account</h1>
          <p className="font-sans text-brand-mist">
            Welcome back, {user?.firstName} {user?.lastName}
          </p>
        </div>
      </div>

      <div className="section-padding max-w-6xl mx-auto py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="space-y-2" aria-label="Account navigation">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-luxury text-left font-sans text-sm transition-all duration-200",
                      activeTab === tab.id
                        ? "bg-brand-ink text-brand-offWhite"
                        : "text-brand-slate hover:bg-brand-blush/50"
                    )}
                    aria-current={activeTab === tab.id ? "page" : undefined}
                  >
                    <Icon size={18} />
                    {tab.label}
                    <ChevronRight
                      size={16}
                      className={cn(
                        "ml-auto transition-transform",
                        activeTab === tab.id ? "rotate-90" : ""
                      )}
                    />
                  </button>
                );
              })}

              <hr className="border-brand-rose/20 my-4" />

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-luxury text-left font-sans text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-luxury shadow-card p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-2xl text-brand-ink">Profile Information</h2>
                    {!isEditingProfile && (
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-sans text-brand-rose hover:bg-brand-blush/50 rounded-full transition-colors"
                      >
                        <Edit2 size={16} />
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {profileSuccess && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-luxury flex items-center gap-2">
                      <CheckCircle2 size={18} />
                      {profileSuccess}
                    </div>
                  )}

                  {profileError && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-luxury flex items-center gap-2">
                      <AlertCircle size={18} />
                      {profileError}
                    </div>
                  )}

                  {isEditingProfile ? (
                    <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                            First Name
                          </label>
                          <input
                            {...registerProfile("firstName")}
                            className={cn(
                              "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                              profileErrors.firstName ? "border-red-300" : "border-brand-rose/20"
                            )}
                          />
                          {profileErrors.firstName && (
                            <p className="mt-1 text-xs text-red-500">{profileErrors.firstName.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                            Last Name
                          </label>
                          <input
                            {...registerProfile("lastName")}
                            className={cn(
                              "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                              profileErrors.lastName ? "border-red-300" : "border-brand-rose/20"
                            )}
                          />
                          {profileErrors.lastName && (
                            <p className="mt-1 text-xs text-red-500">{profileErrors.lastName.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={user?.email}
                          disabled
                          className="w-full px-4 py-3 border border-brand-rose/20 rounded-luxury text-sm bg-brand-offWhite/50 text-brand-mist"
                        />
                        <p className="mt-1 text-xs text-brand-mist">Email cannot be changed</p>
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                          Phone <span className="font-normal">(Optional)</span>
                        </label>
                        <input
                          {...registerProfile("phone")}
                          className={cn(
                            "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                            profileErrors.phone ? "border-red-300" : "border-brand-rose/20"
                          )}
                          placeholder="+1 (555) 123-4567"
                        />
                        {profileErrors.phone && (
                          <p className="mt-1 text-xs text-red-500">{profileErrors.phone.message}</p>
                        )}
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={isProfileSubmitting}
                          className="px-6 py-3 bg-brand-ink text-brand-offWhite rounded-full text-sm font-medium uppercase tracking-wider hover:bg-brand-ink/90 disabled:opacity-50 flex items-center gap-2"
                        >
                          {isProfileSubmitting && <Loader2 size={16} className="animate-spin" />}
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingProfile(false);
                            resetProfile({
                              firstName: user?.firstName || "",
                              lastName: user?.lastName || "",
                              phone: user?.phone || "",
                            });
                          }}
                          className="px-6 py-3 border border-brand-ink/20 text-brand-ink rounded-full text-sm font-medium uppercase tracking-wider hover:bg-brand-ink hover:text-brand-offWhite transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 py-4 border-b border-brand-rose/10">
                        <div>
                          <p className="text-xs font-sans uppercase tracking-wider text-brand-mist mb-1">First Name</p>
                          <p className="text-brand-ink">{user?.firstName}</p>
                        </div>
                        <div>
                          <p className="text-xs font-sans uppercase tracking-wider text-brand-mist mb-1">Last Name</p>
                          <p className="text-brand-ink">{user?.lastName}</p>
                        </div>
                      </div>
                      <div className="py-4 border-b border-brand-rose/10">
                        <p className="text-xs font-sans uppercase tracking-wider text-brand-mist mb-1">Email</p>
                        <p className="text-brand-ink">{user?.email}</p>
                      </div>
                      <div className="py-4">
                        <p className="text-xs font-sans uppercase tracking-wider text-brand-mist mb-1">Phone</p>
                        <p className="text-brand-ink">{user?.phone || "Not provided"}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <h2 className="font-serif text-2xl text-brand-ink mb-6">Order History</h2>
                  
                  {orders.length === 0 ? (
                    <div className="bg-white rounded-luxury shadow-card p-12 text-center">
                      <Package size={48} className="mx-auto mb-4 text-brand-rose/50" />
                      <h3 className="font-serif text-xl text-brand-ink mb-2">No Orders Yet</h3>
                      <p className="text-brand-slate mb-6">Start shopping to see your orders here</p>
                      <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-ink text-brand-offWhite rounded-full text-sm font-medium uppercase tracking-wider hover:bg-brand-ink/90 transition-colors"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    orders.map((order) => <OrderCard key={order.id} order={order} />)
                  )}
                </motion.div>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-2xl text-brand-ink">Saved Addresses</h2>
                    {!isAddingAddress && (
                      <button
                        onClick={() => setIsAddingAddress(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-sans text-brand-rose hover:bg-brand-blush/50 rounded-full transition-colors"
                      >
                        <Plus size={16} />
                        Add Address
                      </button>
                    )}
                  </div>

                  {isAddingAddress && (
                    <div className="bg-white rounded-luxury shadow-card p-6 mb-6">
                      <h3 className="font-serif text-lg text-brand-ink mb-4">
                        {editingAddressId ? "Edit Address" : "Add New Address"}
                      </h3>
                      <form onSubmit={handleAddressSubmit(onAddressSubmit)} className="space-y-4">
                        <div>
                          <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                            Address Label
                          </label>
                          <input
                            {...registerAddress("label")}
                            placeholder="e.g., Home, Work"
                            className={cn(
                              "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                              addressErrors.label ? "border-red-300" : "border-brand-rose/20"
                            )}
                          />
                          {addressErrors.label && (
                            <p className="mt-1 text-xs text-red-500">{addressErrors.label.message}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                              First Name
                            </label>
                            <input
                              {...registerAddress("firstName")}
                              className={cn(
                                "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                                addressErrors.firstName ? "border-red-300" : "border-brand-rose/20"
                              )}
                            />
                            {addressErrors.firstName && (
                              <p className="mt-1 text-xs text-red-500">{addressErrors.firstName.message}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                              Last Name
                            </label>
                            <input
                              {...registerAddress("lastName")}
                              className={cn(
                                "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                                addressErrors.lastName ? "border-red-300" : "border-brand-rose/20"
                              )}
                            />
                            {addressErrors.lastName && (
                              <p className="mt-1 text-xs text-red-500">{addressErrors.lastName.message}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                            Street Address
                          </label>
                          <input
                            {...registerAddress("address1")}
                            className={cn(
                              "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                              addressErrors.address1 ? "border-red-300" : "border-brand-rose/20"
                            )}
                          />
                          {addressErrors.address1 && (
                            <p className="mt-1 text-xs text-red-500">{addressErrors.address1.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                            Apartment, Suite, etc. <span className="font-normal">(Optional)</span>
                          </label>
                          <input
                            {...registerAddress("address2")}
                            className="w-full px-4 py-3 border border-brand-rose/20 rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                              City
                            </label>
                            <input
                              {...registerAddress("city")}
                              className={cn(
                                "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                                addressErrors.city ? "border-red-300" : "border-brand-rose/20"
                              )}
                            />
                            {addressErrors.city && (
                              <p className="mt-1 text-xs text-red-500">{addressErrors.city.message}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                              State
                            </label>
                            <input
                              {...registerAddress("state")}
                              className={cn(
                                "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                                addressErrors.state ? "border-red-300" : "border-brand-rose/20"
                              )}
                            />
                            {addressErrors.state && (
                              <p className="mt-1 text-xs text-red-500">{addressErrors.state.message}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                              Postal Code
                            </label>
                            <input
                              {...registerAddress("postalCode")}
                              className={cn(
                                "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                                addressErrors.postalCode ? "border-red-300" : "border-brand-rose/20"
                              )}
                            />
                            {addressErrors.postalCode && (
                              <p className="mt-1 text-xs text-red-500">{addressErrors.postalCode.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                              Country
                            </label>
                            <select
                              {...registerAddress("country")}
                              className="w-full px-4 py-3 border border-brand-rose/20 rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30 bg-white"
                            >
                              <option value="USA">United States</option>
                              <option value="CAN">Canada</option>
                              <option value="UK">United Kingdom</option>
                              <option value="AUS">Australia</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-sans font-medium uppercase tracking-wider text-brand-slate mb-2">
                              Phone
                            </label>
                            <input
                              {...registerAddress("phone")}
                              className={cn(
                                "w-full px-4 py-3 border rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30",
                                addressErrors.phone ? "border-red-300" : "border-brand-rose/20"
                              )}
                            />
                            {addressErrors.phone && (
                              <p className="mt-1 text-xs text-red-500">{addressErrors.phone.message}</p>
                            )}
                          </div>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            {...registerAddress("isDefault")}
                            type="checkbox"
                            className="w-4 h-4 rounded border-brand-rose/30 text-brand-rose focus:ring-brand-rose/30"
                          />
                          <span className="text-sm text-brand-slate">Set as default address</span>
                        </label>

                        <div className="flex gap-3 pt-4">
                          <button
                            type="submit"
                            disabled={isAddressSubmitting}
                            className="px-6 py-3 bg-brand-ink text-brand-offWhite rounded-full text-sm font-medium uppercase tracking-wider hover:bg-brand-ink/90 disabled:opacity-50 flex items-center gap-2"
                          >
                            {isAddressSubmitting && <Loader2 size={16} className="animate-spin" />}
                            {editingAddressId ? "Update Address" : "Save Address"}
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelAddress}
                            className="px-6 py-3 border border-brand-ink/20 text-brand-ink rounded-full text-sm font-medium uppercase tracking-wider hover:bg-brand-ink hover:text-brand-offWhite transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="grid gap-4">
                    {addresses.length === 0 && !isAddingAddress ? (
                      <div className="bg-white rounded-luxury shadow-card p-12 text-center">
                        <MapPin size={48} className="mx-auto mb-4 text-brand-rose/50" />
                        <h3 className="font-serif text-xl text-brand-ink mb-2">No Addresses Saved</h3>
                        <p className="text-brand-slate">Add an address to speed up your checkout process</p>
                      </div>
                    ) : (
                      addresses.map((address) => (
                        <div
                          key={address.id}
                          className={cn(
                            "bg-white rounded-luxury shadow-card p-6 transition-all",
                            address.isDefault && "ring-2 ring-brand-rose/30"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-sans font-medium text-brand-ink">{address.label}</span>
                                {address.isDefault && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-brand-rose/10 text-brand-deepRose text-xs rounded-full">
                                    <Star size={12} />
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-brand-ink font-medium">
                                {address.firstName} {address.lastName}
                              </p>
                              <p className="text-brand-slate text-sm">{address.address1}</p>
                              {address.address2 && <p className="text-brand-slate text-sm">{address.address2}</p>}
                              <p className="text-brand-slate text-sm">
                                {address.city}, {address.state} {address.postalCode}
                              </p>
                              <p className="text-brand-slate text-sm">{address.country}</p>
                              <p className="text-brand-slate text-sm mt-2">{address.phone}</p>
                            </div>
                            <div className="flex gap-2">
                              {!address.isDefault && (
                                <button
                                  onClick={() => setDefaultAddress(address.id)}
                                  className="p-2 text-brand-mist hover:text-brand-rose hover:bg-brand-blush/50 rounded-full transition-colors"
                                  title="Set as default"
                                >
                                  <Star size={18} />
                                </button>
                              )}
                              <button
                                onClick={() => handleEditAddress(address)}
                                className="p-2 text-brand-mist hover:text-brand-rose hover:bg-brand-blush/50 rounded-full transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="p-2 text-brand-mist hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const statusColors: Record<Order["status"], string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white rounded-luxury shadow-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-brand-rose/10">
        <div>
          <p className="text-xs font-sans uppercase tracking-wider text-brand-mist mb-1">Order Number</p>
          <p className="font-medium text-brand-ink">{order.orderNumber}</p>
        </div>
        <div>
          <p className="text-xs font-sans uppercase tracking-wider text-brand-mist mb-1">Date</p>
          <p className="text-brand-ink">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-xs font-sans uppercase tracking-wider text-brand-mist mb-1">Status</p>
          <span className={cn("px-3 py-1 rounded-full text-xs font-medium capitalize", statusColors[order.status])}>
            {order.status}
          </span>
        </div>
        <div>
          <p className="text-xs font-sans uppercase tracking-wider text-brand-mist mb-1">Total</p>
          <p className="font-medium text-brand-ink">${order.total.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-3">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <Image
              src={item.image}
              alt={item.name}
              width={64}
              height={64}
              className="w-16 h-16 object-cover rounded-luxury"
            />
            <div className="flex-1">
              <p className="font-medium text-brand-ink">{item.name}</p>
              <p className="text-sm text-brand-slate">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium text-brand-ink">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {order.trackingNumber && (
        <div className="mt-4 pt-4 border-t border-brand-rose/10">
          <p className="text-sm text-brand-slate">
            Tracking: <span className="font-medium text-brand-ink">{order.trackingNumber}</span>
          </p>
        </div>
      )}
    </div>
  );
}
