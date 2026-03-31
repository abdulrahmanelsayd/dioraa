import { describe, it, expect } from "vitest";
import { loginSchema, signupSchema, addressSchema } from "./index";

describe("Auth Schemas", () => {
  describe("loginSchema", () => {
    it("should validate correct login credentials", () => {
      const result = loginSchema.safeParse({
        email: "test@example.com",
        password: "password123",
        rememberMe: false,
      });

      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const result = loginSchema.safeParse({
        email: "invalid-email",
        password: "password123",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("email");
      }
    });

    it("should reject password shorter than 8 characters", () => {
      const result = loginSchema.safeParse({
        email: "test@example.com",
        password: "short",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("8 characters");
      }
    });
  });

  describe("signupSchema", () => {
    const validSignup = {
      email: "test@example.com",
      password: "Password123",
      confirmPassword: "Password123",
      firstName: "John",
      lastName: "Doe",
    };

    it("should validate correct signup data", () => {
      const result = signupSchema.safeParse(validSignup);
      expect(result.success).toBe(true);
    });

    it("should reject password without uppercase letter", () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        password: "password123",
        confirmPassword: "password123",
      });

      expect(result.success).toBe(false);
    });

    it("should reject password without number", () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        password: "PasswordOnly",
        confirmPassword: "PasswordOnly",
      });

      expect(result.success).toBe(false);
    });

    it("should reject mismatched passwords", () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        confirmPassword: "DifferentPassword123",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const confirmPasswordError = result.error.issues.find(
          (issue) => issue.path[0] === "confirmPassword"
        );
        expect(confirmPasswordError?.message).toBe("Passwords do not match");
      }
    });

    it("should reject invalid phone number", () => {
      const result = signupSchema.safeParse({
        ...validSignup,
        phone: "invalid-phone",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("addressSchema", () => {
    const validAddress = {
      label: "Home",
      firstName: "John",
      lastName: "Doe",
      address1: "123 Main Street",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA",
      phone: "(555) 123-4567",
      isDefault: true,
    };

    it("should validate correct address data", () => {
      const result = addressSchema.safeParse(validAddress);
      expect(result.success).toBe(true);
    });

    it("should reject empty required fields", () => {
      const result = addressSchema.safeParse({
        ...validAddress,
        firstName: "",
      });

      expect(result.success).toBe(false);
    });

    it("should reject invalid postal code", () => {
      const result = addressSchema.safeParse({
        ...validAddress,
        postalCode: "@#$%",
      });

      expect(result.success).toBe(false);
    });
  });
});
