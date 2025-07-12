const { test, expect } = require('@playwright/test');

test.describe('Consent Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the application
        await page.goto('/');
    });

    test('should display consent form', async ({ page }) => {
        // Wait for consent form to be visible
        await expect(page.locator('[data-testid="consent-form"]')).toBeVisible();
        
        // Check for required consent elements
        await expect(page.locator('text=Terms and Conditions')).toBeVisible();
        await expect(page.locator('text=Privacy Policy')).toBeVisible();
        await expect(page.locator('input[type="checkbox"]')).toBeVisible();
    });

    test('should require consent acceptance', async ({ page }) => {
        const submitButton = page.locator('[data-testid="submit-consent"]');
        
        // Try to submit without accepting consent
        await submitButton.click();
        
        // Should show validation error
        await expect(page.locator('text=Please accept the terms')).toBeVisible();
    });

    test('should allow consent acceptance', async ({ page }) => {
        // Accept consent checkbox
        await page.check('input[type="checkbox"]');
        
        // Submit consent form
        await page.click('[data-testid="submit-consent"]');
        
        // Should proceed to next step
        await expect(page.url()).toContain('/dashboard');
    });

    test('should persist consent choice', async ({ page }) => {
        // Accept consent
        await page.check('input[type="checkbox"]');
        await page.click('[data-testid="submit-consent"]');
        
        // Refresh page
        await page.reload();
        
        // Should not show consent form again
        await expect(page.locator('[data-testid="consent-form"]')).not.toBeVisible();
    });
});