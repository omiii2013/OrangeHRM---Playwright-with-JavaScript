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
        
        // Verify successful login
        await expect(page.locator('xpath=//h6[text()="Dashboard"]')).toBeVisible();

       navigateAndVerifyAdminPage(page);
});

async function navigateAndVerifyAdminPage(page) {

    // Navigate to the Admin module
    await page.locator('//span[text()="Admin"]').click();
        
    // Verify navigation to the Admin page
    await expect(page.locator('//h6[text()="Admin"]')).toBeVisible();
    await expect(page).toHaveURL(/.*\/admin\/viewSystemUsers/);
}

test('Add User Button Verification on Admin Page', async ({ page }) => {

    // Click Add User button
    const addUserButton = page.locator('//button[normalize-space()="Add"]');
    await expect(addUserButton).toBeVisible();
    await addUserButton.click();

    // Verify Add User form is displayed
    const addUserForm = page.locator('//h6[text()="Add User"]');
    await expect(addUserForm).toBeVisible();

});

test('Add User Form Fields', async ({ page }) => {

    // Click Add User button
    const addUserButton = page.locator('//button[normalize-space()="Add"]');
    await addUserButton.click();

    // Add user data in all fields
    await page.locator('//label[text()="User Role"]/following::div[contains(@class, "oxd-select-text")]').click();

    // Select "Admin" from the dropdown
    const userRoleOptions = page.locator('//span[contains(text(),"Admin")]');
    userRoleOptions.toBeVisible();
    await userRoleOptions.click();

    // Enter Employee Name
    await page.locator('//input[@placeholder="Type for hints..."]').fill('Test Automation Ar');
    await page.waitForTimeout(1000); // Wait for the dropdown to populate
    await page.locator('//div[@role="option"]').click();

    // Enter Username
    await page.locator('//label[text()="Username"]/..//following-sibling::div').fill('Test Automation');

    // Select Status
    await page.locator('//label[text()="Status"]/following::div[contains(@class, "oxd-select-text")][1]').click();
    
    const statusOptions = page.locator('//span[contains(text(),"Enabled")]');
    statusOptions.toBeVisible();
    await statusOptions.click();

    // Enter Password
    await page.locator('//label[text()="Password"]/..//following-sibling::div//input').fill('Admin@123');

    // Enter Confirm Password
    await page.locator('//label[text()="Confirm Password"]/..//following-sibling::div//input').fill('Admin@123');
    
    // Verify that all fields
    verifyAllFields(page);

    // Click Save button
    await page.locator('//button[normalize-space()="Save"]').click();

    // Verify user is added successfully by checking for a success message
    const successMessage = page.locator('//div[contains(@class, "oxd-toast-container")]//p[text()="Successfully Saved"]');
    await expect(successMessage).toBeVisible();

});

async function verifyAllFields(page) {

    // Verify all fields are filled correctly
    const userRoleValue = await page.locator('//label[text()="User Role"]/following::div[contains(@class, "oxd-select-text")]/span').innerText();
    const employeeNameValue = await page.locator('//input[@placeholder="Type for hints..."]').inputValue();
    const usernameValue = await page.locator('//label[text()="Username"]/..//following-sibling::div//input').inputValue();
    const statusValue = await page.locator('//label[text()="Status"]/following::div[contains(@class, "oxd-select-text")]/span').innerText();
    const passwordValue = await page.locator('//label[text()="Password"]/..//following-sibling::div//input').inputValue();
    const confirmPasswordValue = await page.locator('//label[text()="Confirm Password"]/..//following-sibling::div//input').inputValue();

    expect(userRoleValue).toBe('Admin');
    expect(employeeNameValue).toBe('Test Automation Ar');
    expect(usernameValue).toBe('Test Automation');
    expect(statusValue).toBe('Enabled');
    expect(passwordValue).toBe('Admin@123');
    expect(confirmPasswordValue).toBe('Admin@123');
}

test('Search User Functionality on Admin Page', async ({ page }) => {

    // Enter Username in the search field
    await page.locator('//label[text()="Username"]/..//following-sibling::div//input').fill('Admin');

    // Click Search button
    await page.locator('//button[normalize-space()="Search"]').click();

    // Verify search results
    const resultsTable = page.locator('//div[@class="oxd-table-card"]//div[@role="row"]');
    await expect(resultsTable).toBeVisible();
    await expect(resultsTable).toHaveCountGreaterThan(0);

    // Verify that at least one of the results contains the searched username "Admin"
    const userCell = page.locator('//div[@role="row"]//div[@role="cell" and contains(text(),"Admin")]');
    await expect(userCell).toBeVisible();
});

test('Delete User Functionality on Admin Page', async ({ page }) => {

    // Click on Reset button to clear any previous search filters
    await clickOnResetButton(page);

    // Find the user to delete
    const resultsTable = page.locator('//div[@class="oxd-table-card"]//div[@role="row"]');
    const totalRecordsCount = await resultsTable.count();
    await expect(resultsTable).toBeVisible();
    await expect(resultsTable).toHaveCountGreaterThan(0);

    if(totalRecordsCount < 1) {
        console.log("No records found to delete.");
        return;
    }

    // Choose any random number between 0 and totalRecordsCount - 1
    const randomIndex = Math.floor(Math.random() * totalRecordsCount);
    console.log(`Random index chosen for deletion: ${randomIndex}`);

    // Click the delete icon for the selected user
    const userRow = resultsTable.nth(randomIndex);
    await expect(userRow).toBeVisible();
    await userRow.scrollIntoViewIfNeeded();

    // Click the delete icon (trash bin) in the Actions column
    const deleteIcon = userRow.locator('.oxd-icon.bi-trash');
    await expect(deleteIcon).toBeVisible();
    await deleteIcon.click();
    
    // Confirm deletion in the dialog
    const confirmDeleteButton = page.locator('//button[normalize-space()="Yes, Delete"]');
    await expect(confirmDeleteButton).toBeVisible();
    await confirmDeleteButton.click();

    // Verify user is deleted successfully by checking for a success message
    const successMessage = page.locator('//div[contains(@class, "oxd-toast-container")]//p[text()="Successfully Deleted"]');
    await expect(successMessage).toBeVisible();
});

test('Edit User Functionality on Admin Page', async ({ page }) => {

    // Click on Reset button to clear any previous search filters
    await clickOnResetButton(page);

    // Find the user to edit
    const resultsTable = page.locator('//div[@class="oxd-table-card"]//div[@role="row"]');
    const totalRecordsCount = await resultsTable.count();
    await expect(resultsTable).toBeVisible();
    await expect(resultsTable).toHaveCountGreaterThan(0);

    if(totalRecordsCount < 1) {
        console.log("No records found to edit.");
        return;
    }
    
    // Choose any random number between 0 and totalRecordsCount - 1
    const randomIndex = Math.floor(Math.random() * totalRecordsCount);
    console.log(`Random index chosen for editing: ${randomIndex}`);

    // Click the edit icon for the selected user
    const userRow = resultsTable.nth(randomIndex);
    await expect(userRow).toBeVisible();
    await userRow.scrollIntoViewIfNeeded();

    // Click the edit icon (pencil) in the Actions column
    const editIcon = userRow.locator('.oxd-icon.bi-pencil-fill');
    await expect(editIcon).toBeVisible();
    await editIcon.click();

    // Change Username
    const usernameField = page.locator('//label[text()="Username"]/..//following-sibling::div');
    await expect(usernameField).toBeVisible();
    await usernameField.fill("EditedUser");

    // Save changes
    await page.locator('//button[normalize-space()="Save"]').click();

    // Verify user is edited successfully by checking for a success message
    const successMessage = page.locator('//div[contains(@class, "oxd-toast-container")]//p[text()="Successfully Updated"]');
    await expect(successMessage).toBeVisible();

});

test('Verify Count of Records on Admin Page', async ({ page }) => {

    // Count the number of records displayed in the results table
    const resultsTable = page.locator('//div[@class="oxd-table-card"]//div[@role="row"]');
    const totalRecordsCount = await resultsTable.count();
    await expect(resultsTable).toBeVisible();
    await expect(resultsTable).toHaveCountGreaterThan(0);

    // Match that count with the text showing total records
    const totalRecordsText = page.locator('//div[contains(@class, "orangehrm-horizontal-padding")]//span');
    await expect(totalRecordsText).toBeVisible();
    const totalRecordsTextValue = await totalRecordsText.innerText();
    const totalRecords = parseInt(totalRecordsTextValue.split(')')[0].replace('(', '').trim());

    expect(totalRecords).toBe(totalRecordsCount);
});

test('Pagination Functionality on Admin Page', async ({ page }) => {

    // Check if pagination is present
    const pagination = page.locator('//nav[@aria-label="Pagination Navigation"]');
    const isPaginationVisible = await pagination.isVisible();

    if (isPaginationVisible) {

        // Click on the next page button
        const nextPageButton = pagination.locator('//button[contains(@class, "previous-next")]');
        await expect(nextPageButton).toBeVisible();
        await nextPageButton.click();

        // Verify that the page has changed by checking the active page number
        const activePageNumber = pagination.locator('//button[contains(@class, "page-selected")]');
        await expect(activePageNumber).toBeVisible();

        const activePageNumberValue = await activePageNumber.innerText();
        expect(activePageNumberValue).toBe('2'); // Assuming we navigated to page 2
    } else {
        console.log("Pagination is not present as there are fewer records.");
    }
});

test('Reset Button Functionality on Admin Page', async ({ page }) => {

    // Enter Username in the search field
    await page.locator('//label[text()="Username"]/..//following-sibling::div//input').fill('TestData');

    // Select User Role
    await page.locator('//label[text()="User Role"]/following::div[contains(@class, "oxd-select-text")]').click();
    // Select "Admin" from the dropdown
    const userRoleOptions = page.locator('//span[contains(text(),"Admin")]');
    userRoleOptions.toBeVisible();
    await userRoleOptions.click();

    // Enter Employee Name
    await page.locator('//input[@placeholder="Type for hints..."]').fill('Orange Test');
    await page.waitForTimeout(3000); // Wait for the dropdown to populate
    await page.locator('//div[@role="option"]').click();

    // Select Status
    await page.locator('//label[text()="Status"]/following::div[contains(@class, "oxd-select-text")][1]').click();

    // Click Reset button
    await page.locator('//button[normalize-space()="Reset"]').click();

    // Verify that all fields are cleared
    const usernameValue = await page.locator('//label[text()="Username"]/..//following-sibling::div//input').inputValue();
    const employeeNameValue = await page.locator('//input[@placeholder="Type for hints..."]').inputValue();
    const userRoleValue = await page.locator('//label[text()="User Role"]/following::div[contains(@class, "oxd-select-text")]/span').innerText();
    const statusValue = await page.locator('//label[text()="Status"]/following::div[contains(@class, "oxd-select-text")][1]').innerText();

    expect(usernameValue).toBe('');
    expect(employeeNameValue).toBe('');
    expect(userRoleValue).toBe('-- Select --');
    expect(statusValue).toBe('-- Select --');

});

async function clickOnResetButton(page) {

     // Click on Reset button to clear any previous search filters
    await page.locator('//button[normalize-space()="Reset"]').click();
}

test('Checkbox Selection Functionality on Admin Page', async ({ page }) => {

    // Check if there are records to select or not
    const resultsTable = page.locator('//div[@class="oxd-table-card"]//div[@role="row"]');
    const totalRecordsCount = await resultsTable.count();
    
    if (totalRecordsCount > 0 ) {
        
        // Choose any random number between 0 and totalRecordsCount - 1
        const randomIndex = Math.floor(Math.random() * totalRecordsCount);
        console.log(`Random index chosen for editing: ${randomIndex}`);
    
        // Click the edit icon for the selected user
        const userRow = resultsTable.nth(randomIndex);
        await expect(userRow).toBeVisible();
        await userRow.scrollIntoViewIfNeeded();

        // Click the checkbox in the first column
        const checkbox = userRow.locator('//span[contains(@class, "oxd-checkbox")]');
        await expect(checkbox).toBeVisible();
        await checkbox.click();

        // Verify that the checkbox is selected
        const isChecked = await checkbox.locator('input').isChecked();
        expect(isChecked).toBe(true);

    } else {
        console.log("No records found to select.");
        return;
    }

});

test.afterEach(async ({ page }) => {

    await page.close();
});