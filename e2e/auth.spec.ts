import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display navbar with auth button", async ({ page }) => {
    // Check navbar is visible
    await expect(page.locator("nav")).toBeVisible();
  });

  test("should show sign in prompt on account page when not authenticated", async ({ page }) => {
    // Navigate to account page
    await page.goto("/account");

    // Should show sign in prompt since not authenticated
    await expect(page.getByText(/please sign in/i)).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Homepage", () => {
  test("should load hero section", async ({ page }) => {
    await page.goto("/");

    // Check hero section exists (use first section which is the hero)
    const heroSection = page.locator("section").first();
    await expect(heroSection).toBeVisible();

    // Check hero content
    await expect(page.getByText(/pure/i)).toBeVisible();
    await expect(page.getByText(/radiant/i)).toBeVisible();
  });

  test("should display best sellers section", async ({ page }) => {
    await page.goto("/");

    // Scroll to best sellers
    await page.locator("#bestsellers").scrollIntoViewIfNeeded();

    // Check best sellers section is visible
    await expect(page.locator("#bestsellers")).toBeVisible();

    // Check products are visible (use the product link selector)
    await expect(page.locator("a[href^='/product/']").first()).toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe("Product Navigation", () => {
  test("should navigate to product detail page", async ({ page }) => {
    await page.goto("/");

    // Wait for products to load
    await page.locator("#bestsellers").scrollIntoViewIfNeeded();

    // Click on first product
    const firstProduct = page.locator("a[href^='/product/']").first();
    await firstProduct.click();

    // Should be on product page
    await expect(page).toHaveURL(/\/product\//);
  });
});
