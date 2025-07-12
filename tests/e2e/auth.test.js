const { test, expect } = require('@playwright/test');

test.describe('Authentication Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should login with valid credentials', async ({ page }) => {
        await page.fill('[data-testid="username"]', 'testuser');
        await page.fill('[data-testid="password"]', 'testpassword');
        await page.click('[data-testid="login-button"]');
        
        await expect(page).toHaveURL('/dashboard');
        await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
    });

    test('should show error with invalid credentials', async ({ page }) => {
        await page.fill('[data-testid="username"]', 'invaliduser');
        await page.fill('[data-testid="password"]', 'wrongpassword');
        await page.click('[data-testid="login-button"]');
        
        await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
        await expect(page.locator('[data-testid="error-message"]')).toHaveText('Invalid credentials');
    });

    test('should logout successfully', async ({ page }) => {
        // Login first
        await page.fill('[data-testid="username"]', 'testuser');
        await page.fill('[data-testid="password"]', 'testpassword');
        await page.click('[data-testid="login-button"]');
        
        // Then logout
        await page.click('[data-testid="logout-button"]');
        await expect(page).toHaveURL('/');
    });

    test('should redirect to login when accessing protected route', async ({ page }) => {
        await page.goto('/dashboard');
        await expect(page).toHaveURL('/login');
    });
});