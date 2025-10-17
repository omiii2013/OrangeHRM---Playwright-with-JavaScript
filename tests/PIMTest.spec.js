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

async function clickAndAddEmployeeDetails() {

    // Click on Add Employee button
    await page.locator('//button[normalize-space()="Add"]').click();
    
    // Verify navigation to Add Employee page
    await expect(page.locator('//h6[text()="Add Employee"]')).toBeVisible();
    await expect(page.locator('//h6[text()="Add Employee"]')).toHaveText('Add Employee');

    // Add Employee form fields
    await page.getByPlaceholder('First Name').fill('John');
    await page.getByPlaceholder('Middle Name').fill('A');
    await page.getByPlaceholder('Last Name').fill('Doe');

}

test('Add Employee Button Verification on PIM Page', async ({ page }) => {

    // Add Employee Details
    await clickAndAddEmployeeDetails();

    // Save the new employee
    await page.locator('button[type="submit"]').click();
});

test('Add Employee and Create Login Details', async ({ page }) => {
    
    // Add Employee Details
    await clickAndAddEmployeeDetails();

    // Enable Create Login Details toggle
    await page.locator('//span[contains(@class, "oxd-switch-input")]').click();
    let IsLoginToggled = await expect(page.locator('//span[contains(@class, "oxd-switch-input")]')).toBeChecked();

    if (IsLoginToggled) {

        // Fill in login details
        await page.locator('//label[text()="Username"]/..//following-sibling::div//input[contains(@class, "oxd-input")]').fill('JohnDoe123');
        await page.locator('//label[text()="Password"]/..//following-sibling::div//input[contains(@class, "oxd-input")]').fill('John@@12345');
        await page.locator('//label[text()="Confirm Password"]/..//following-sibling::div//input[contains(@class, "oxd-input")]').fill('John@@12345');
    }
    else {
        console.log("Create Login Details toggle is not enabled");
    }

    // Save the new employee
    await page.locator('button[type="submit"]').click();
});

test('Employee Search Functionality on PIM Page', async ({ page }) => {


});

let totalRecords = 0;
test('Count Total No. of Records', async ({ page }) => {
    
    // Count with the text showing total records
    await expect(totalRecordsText).toBeVisible();
    const totalRecordsTextValue = await totalRecordsText.innerText();
    totalRecords = parseInt(totalRecordsTextValue.split(')')[0].replace('(', '').trim());
    console.log(`Total number of records: ${totalRecords}`);

});

test('Verify Count of Records with Pagination', async ({ page }) => {

    // Check if pagination is present
    const pagination = page.locator('//nav[@aria-label="Pagination Navigation"]');
    const isPaginationVisible = await pagination.isVisible();

    if (isPaginationVisible) {

        // Iterate through pages and count records
        let sumOfRecords = 0;
        let isLastPage = false;
        
        // Loop through pages until the last page is reached
        while (!isLastPage) {

            // Count the number of records on the current page
            const resultsTable = page.locator('//div[@class="oxd-table-card"]//div[@role="row"]');
            const totalCountOnPage = await resultsTable.count();
            sumOfRecords += totalCountOnPage;

            // Check if the "Next" button is enabled
            const nextButton = page.locator('//button[contains(@class, "previous-next")]');
            const isNextButtonEnabled = await nextButton.isEnabled();
            
            if (isNextButtonEnabled) {
                await nextButton.click();
                await page.waitForTimeout(1000); // Wait for the next page to load
            } 
            else {
                isLastPage = true; // Exit the loop if "Next" button is disabled
            }
        } 
    }
    else {

        // If no pagination, count records on the single page
        const resultsTable = page.locator('//div[@class="oxd-table-card"]//div[@role="row"]');
        sumOfRecords = await resultsTable.count();
    }

    // Compare the counted records with the total records
    if (sumOfRecords === totalRecords) {
        console.log("The counted records match the total records.");
    } 
    else {
        console.log("The counted records do not match the total records.");
    }
});

test('Verify Search on Each Employee ID on First Page', async ({ page }) => {

    // Locate the Employee ID search field
    const employeeIDSearchField = page.locator('//input[@class="oxd-input oxd-input--active"]');
    await expect(employeeIDSearchField).toBeVisible();

    // Loop through each employee ID in the results table
    const resultsTable = page.locator('//div[@class="oxd-table-card"]//div[@role="row"]');
    const totalCountOnPage = await resultsTable.count();

    for (let i = 0; i < totalCountOnPage; i++) {
        
        const employeeID = await resultsTable.nth(i).locator('//div[@role="cell"][2]').innerText();
        await employeeIDSearchField.fill(employeeID);

        // Click the search button
        await page.locator('//button[@type="submit"]').click();

        // Verify that the search results contain only the searched employee ID
        const totalRecordsText = page.locator('//div[contains(@class, "orangehrm-horizontal-padding")]//span');
        const totalRecordsTextValue = await totalRecordsText.innerText();
        const totalRecords = parseInt(totalRecordsTextValue.split(')')[0].replace('(', '').trim());

        if (totalRecords === 1) {
            console.log(`Search successful for Employee ID: ${employeeID}`);
        }
        else {
            console.log(`Search failed for Employee ID: ${employeeID}`);
        }
        
        // Clear the search field for the next iteration
        await employeeIDSearchField.fill('');
    }
});

test('Verify Each Employee Name in the List', async ({ page }) => {

});

test('Verify Reports Nav Bar on PIM Page', async ({ page }) => {

    // Locate and click the Reports option in the PIM module's navigation bar
    const reportsNavBarOption = page.locator('//a[normalize-space()="Reports"]');
    await expect(reportsNavBarOption).toBeVisible();

    await reportsNavBarOption.click();

    // Verify navigation to the Reports page
    await expect(page.locator('//h5[normalize-space()="Employee Reports"]')).toBeVisible();
});

test.afterEach(async ({ page }) => {

    await page.close();
});