import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuthStore } from "./useAuthStore";

describe("useAuthStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      addresses: [],
      orders: [],
    });
    // Clear localStorage
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("should fail with invalid credentials", async () => {
      const { result } = renderHook(() => useAuthStore());

      let loginResult: { success: boolean; error?: string };
      await act(async () => {
        loginResult = await result.current.login({
          email: "nonexistent@test.com",
          password: "wrongpassword",
        });
      });

      expect(loginResult!.success).toBe(false);
      expect(loginResult!.error).toBe("Invalid email or password");
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("should validate email format", async () => {
      const { result } = renderHook(() => useAuthStore());

      let loginResult: { success: boolean; error?: string };
      await act(async () => {
        loginResult = await result.current.login({
          email: "invalid-email",
          password: "password123",
        });
      });

      expect(loginResult!.success).toBe(false);
    });
  });

  describe("signup", () => {
    it("should create a new user successfully", async () => {
      const { result } = renderHook(() => useAuthStore());

      let signupResult: { success: boolean; error?: string };
      await act(async () => {
        signupResult = await result.current.signup({
          email: "newuser@test.com",
          password: "Password123",
          confirmPassword: "Password123",
          firstName: "John",
          lastName: "Doe",
        });
      });

      expect(signupResult!.success).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toMatchObject({
        email: "newuser@test.com",
        firstName: "John",
        lastName: "Doe",
      });
    });

    it("should prevent duplicate email registration", async () => {
      const { result } = renderHook(() => useAuthStore());

      // First signup
      await act(async () => {
        await result.current.signup({
          email: "duplicate@test.com",
          password: "Password123",
          confirmPassword: "Password123",
          firstName: "First",
          lastName: "User",
        });
      });

      // Second signup with same email
      let secondResult: { success: boolean; error?: string };
      await act(async () => {
        secondResult = await result.current.signup({
          email: "duplicate@test.com",
          password: "Password456",
          confirmPassword: "Password456",
          firstName: "Second",
          lastName: "User",
        });
      });

      expect(secondResult!.success).toBe(false);
      expect(secondResult!.error).toBe(
        "An account with this email already exists"
      );
    });
  });

  describe("logout", () => {
    it("should clear user state on logout", async () => {
      const { result } = renderHook(() => useAuthStore());

      // First, sign up a user
      await act(async () => {
        await result.current.signup({
          email: "logout@test.com",
          password: "Password123",
          confirmPassword: "Password123",
          firstName: "Test",
          lastName: "User",
        });
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.addresses).toEqual([]);
      expect(result.current.orders).toEqual([]);
    });
  });

  describe("address management", () => {
    it("should add a new address", async () => {
      const { result } = renderHook(() => useAuthStore());

      // First, sign up a user
      await act(async () => {
        await result.current.signup({
          email: "address@test.com",
          password: "Password123",
          confirmPassword: "Password123",
          firstName: "Test",
          lastName: "User",
        });
      });

      // Add address
      let addResult: { success: boolean; error?: string };
      await act(async () => {
        addResult = await result.current.addAddress({
          label: "Home",
          firstName: "Test",
          lastName: "User",
          address1: "123 Test St",
          city: "Test City",
          state: "TS",
          postalCode: "12345",
          country: "USA",
          phone: "+1 (555) 123-4567",
          isDefault: true,
        });
      });

      expect(addResult!.success).toBe(true);
      expect(result.current.addresses).toHaveLength(1);
      expect(result.current.addresses[0]).toMatchObject({
        label: "Home",
        city: "Test City",
        isDefault: true,
      });
    });

    it("should not allow address operations when not authenticated", async () => {
      const { result } = renderHook(() => useAuthStore());

      let addResult: { success: boolean; error?: string };
      await act(async () => {
        addResult = await result.current.addAddress({
          label: "Home",
          firstName: "Test",
          lastName: "User",
          address1: "123 Test St",
          city: "Test City",
          state: "TS",
          postalCode: "12345",
          country: "USA",
          phone: "+1 (555) 123-4567",
          isDefault: true,
        });
      });

      expect(addResult!.success).toBe(false);
      expect(addResult!.error).toBe("Not authenticated");
    });
  });
});
