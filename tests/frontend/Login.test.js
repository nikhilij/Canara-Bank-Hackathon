const { test, expect } = require('@playwright/test');

test.describe('Login Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('should display login form', async ({ page }) => {
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should login with valid credentials', async ({ page }) => {
        await page.fill('input[type="email"]', 'test@example.com');
        await page.fill('input[type="password"]', 'password123');
        await page.click('button[type="submit"]');
        
        await expect(page).toHaveURL('/dashboard');
    });

    test('should show error with invalid credentials', async ({ page }) => {
        await page.fill('input[type="email"]', 'invalid@example.com');
        await page.fill('input[type="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');
        
        await expect(page.locator('.error-message')).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
        await page.click('button[type="submit"]');
        
        await expect(page.locator('input[type="email"]:invalid')).toBeVisible();
        await expect(page.locator('input[type="password"]:invalid')).toBeVisible();
    });
});