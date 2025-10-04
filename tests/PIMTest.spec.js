import {test, expect} from '@playwright/test';
import { beforeEach } from 'node:test';

let url = 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index';
let title = 'OrangeHRM';
const modules = ["Admin / User Management", "PIM", "Leave", "Time / Timesheets", "Recruitment", "Performance", "Dashboard", "Directory", "Claim", "Buzz"];

test.beforeEach(async ({ page }) => {

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

async function navigateAndVerifyPIMPage(page) {

    // Navigate to the PIM module
    await page.locator('//span[text()="PIM"]').click();
        
    // Verify navigation to the PIM page
    await expect(page.locator('//h6[text()="PIM"]')).toBeVisible();
    await expect(page.locator('//h6[text()="PIM"]')).toHaveText('PIM');

}

test('PIM Page Navigation and Verification', async ({ page }) => {
    
    // Navigate to PIM page and verify page
    await navigateAndVerifyPIMPage(page);
});

test('Add Employee Button Verification on PIM Page', async ({ page }) => {

});

test('Employee Search Functionality on PIM Page', async ({ page }) => {

});

test('Count Total No. of Records', async ({ page }) => {
    
});

test('Verify Count of Records with Pagination', async ({ page }) => {

});

test('Verify Each Employee Name in the List', async ({ page }) => {

});

test('Verify Reports Nav Bar on PIM Page', async ({ page }) => {

});



test.afterEach(async ({ page }) => {

    await page.close();
});