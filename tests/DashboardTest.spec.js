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

test('Dashboard Page Verification', async ({ page }) => {
   
    // Verify the Title bar
    const titleBar = page.locator('//h6[contains(@class, "topbar-header-breadcrumb")]');
    await expect(titleBar).toBeVisible();
    await expect(titleBar).toHaveText('Dashboard');

});

test('My Actions Section Verification', async ({ page }) => {

    // Verify the My Actions section
    const myActionsSection = page.locator('//p[normalize-space()="My Actions"]');
    await expect(myActionsSection).toBeVisible();
    await expect(myActionsSection).toHaveText('My Actions');

});

test('My Actions - Count Todo List Items and Verify Every Todo Option', async ({ page }) => {
    
    // Locate the My Actions section
    const myActionsSection = page.locator('//p[normalize-space()="My Actions"]');
    await expect(myActionsSection).toBeVisible();

    // Locate the Todo List items within the My Actions section
    const todoListItems = page.locator('//div[@class="orangehrm-todo-list-item"]');
    const itemCount = await todoListItems.count();

    // Log the count of Todo List items
    console.log(`Count of Todo List items: ${itemCount}`);

    // Verify each Todo option
    for (let i = 0; i < itemCount; i++) {

        const todoItem = todoListItems.nth(i);
        await expect(todoItem).toBeVisible();
        
        // Create a function to click and verify each todo item
        await (async () => {
            await todoItem.click();

            // Verify the title bar of page after clicking the todo item
            const titleBar = page.locator('//span[contains(@class, "topbar-header-breadcrumb")]');
            await expect(titleBar).toBeVisible();
            await expect(titleBar).not.toHaveText('Dashboard');
            

            // Navigate back to the Dashboard page
            await page.goto(url);

            // Ensure the My Actions section is still visible
            await expect(myActionsSection).toBeVisible();

        })();

    }
});

test('Verify Each Quick Launch Icon and its Functionality', async ({ page }) => {

    // Locate the Quick Launch section
    const quickLaunchSection = page.locator('//p[normalize-space()="Quick Launch"]');
    await expect(quickLaunchSection).toBeVisible();

    // Locate the Quick Launch icons within the Quick Launch section
    const quickLaunchIcons = page.locator('//button[contains(@class, "orangehrm-quick-launch-icon")]');
    const iconCount = await quickLaunchIcons.count();

    // Log the count of Quick Launch icons
    console.log(`Count of Quick Launch icons: ${iconCount}`);

    // Verify each Quick Launch icon
    for (let i = 0; i < iconCount; i++) {

        const quickLaunchIcon = quickLaunchIcons.nth(i);
        await expect(quickLaunchIcon).toBeVisible();
        
        // Create a function to click and verify each quick launch icon
        (async () => {
            await quickLaunchIcon.click();

            // Verify the title bar of page after clicking the quick launch icon
            const titleBar = page.locator('//span[contains(@class, "topbar-header-breadcrumb")]');
            await expect(titleBar).toBeVisible();
            const titleBarText = await titleBar.innerText();
            await expect(titleBarText).toBeOneOf(modules);

            // Navigate back to the Dashboard page
            await page.goto(url);
        });
    }
});

// test('Employee Distribution by Sub Unit Section Verification', async ({ page }) => {

//     // Verify the Employee Distribution by Subunit section
//     const employeeDistributionSection = page.locator('//p[normalize-space()="Employee Distribution by Sub Unit"]');
//     await expect(employeeDistributionSection).toBeVisible();

//     // Hover over the chart to see if tooltip appears
//     const chart = page.locator('//p[normalize-space()="Employee Distribution by Sub Unit"]/../..//following-sibling::div//div[@class="oxd-pie-chart"]');
//     await chart.hover({position: {x: 10, y: 10}});
    
//     // Wait for the tooltip to appear
//     // await page.waitForSelector('//span[contains(@class, "oxd-pie-chart-tooltip")]', { state: 'visible' });
    
//     const tooltip = await page.locator('//span[contains(@class, "oxd-pie-chart-tooltip")]');
//     await tooltip.waitFor({state: 'visible'});
//     await expect(tooltip).toBeVisible();
    
// });


test.afterEach(async ({ page }) => {

    await page.close();
});