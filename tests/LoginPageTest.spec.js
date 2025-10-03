import { test, expect } from '@playwright/test';
import { beforeEach } from 'node:test';

let url = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
let title = 'OrangeHRM';

test('Login URL and Title Verification', async ({ page }) => {

    // Navigate to the login page
    await page.goto(url);

    // Verify the URL
    await expect(page).toHaveURL(url);

    // Verify the page title
    await expect(page).toHaveTitle(title);

    await page.close();
})

test('Login Functionality Test', async ({ page }) => {

    // Navigate to the login page
    await page.goto(url);
    
    // Enter username
    await page.locator('//input[@name="username"]').fill('Admin');
    
    // Enter password
    await page.locator('//input[@name="password"]').fill('admin123');
    
    // Click the login button
    await page.locator('//button[@type="submit"]').click();
    
    // Verify successful login by checking for a specific element on the dashboard
    await expect(page.locator('xpath=//h6[text()="Dashboard"]')).toBeVisible();
});

test('Invalid Login Test', async ({ page }) => {

    // Navigate to the login page
    await page.goto(url);

    // Enter invalid username
    await page.locator('//input[@name="username"]').fill('InvalidUser');
    
    // Enter invalid password
    await page.locator('//input[@name="password"]').fill('InvalidPass');

    // Click the login button
    await page.locator('//button[@type="submit"]').click();

    // Verify error message is displayed
    const errorMessage = page.locator('//p[contains(@class, "oxd-alert-content--error")]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Invalid credentials');

    await page.close();
});

test('Forget Password Link Test', async ({page}) => {

    // Navigate to the login page
    await page.goto(url);
    
    // Click on the 'Forgot your password' link
    await page.locator('//p[contains(@class, "login-forgot-header")]').click();

    // Verify that the URL has changed to the forgot password page
    await expect(page).toHaveURL(/.*requestPasswordResetCode/);

    // Verify that the forgot password page contains the expected text
    const forgotPasswordText = page.locator('//h6[text()="Reset Password"]');
    await expect(forgotPasswordText).toBeVisible();

});

test('OrangeHRM Link Test', async ({page}) => { 

    // Navigate to the login page
    await page.goto(url);
    
    // Click on the 'OrangeHRM, Inc' link
    const [newPage] = await Promise.all([
        page.waitForEvent('popup'),
        page.locator('//a[text()="OrangeHRM, Inc"]').click()
    ]);

    // Verify that the new page has opened with the expected URL
    await expect(newPage).toHaveURL('https://www.orangehrm.com/');

});

