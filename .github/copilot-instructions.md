# Copilot Instructions for OrangeHRM Playwright JavaScript Project

## Project Overview
This repository automates end-to-end testing for the OrangeHRM demo site using Playwright with JavaScript. Tests are organized for maintainability and clarity, focusing on login and dashboard functionality.

## Directory Structure
- `e2e/` and `tests/`: Main test suites. Example: `LoginPageTest.spec.js` covers login page navigation, title, and authentication.
- `playwright.config.js`: Playwright configuration (browser, base URL, etc.).
- `playwright-report/`, `test-results/`: Output directories for test reports and results.

## Developer Workflows
- **Run all tests:**
  ```sh
  npx playwright test
  ```
- **Run a specific test file:**
  ```sh
  npx playwright test tests/LoginPageTest.spec.js
  ```
- **View HTML report:**
  ```sh
  npx playwright show-report
  ```
- **Debug a test:**
  ```sh
  npx playwright test --debug
  ```

## Test Patterns & Conventions
- Use Playwright's `test` and `expect` for assertions.
- Prefer XPath selectors for element targeting (see `LoginPageTest.spec.js`).
- Always close the page at the end of navigation tests.
- Validate login by checking for dashboard elements (`//h6[text()="Dashboard"]`).
- Store URLs and titles as variables for reuse and clarity.

## Integration Points
- Tests interact directly with the OrangeHRM demo site (`https://opensource-demo.orangehrmlive.com`).
- No custom services or backend integration; all tests are UI-driven.

## External Dependencies
- Playwright (see `package.json` for version).
- No custom test runners or frameworks beyond Playwright.

## Key Files
- `tests/LoginPageTest.spec.js`: Example of login flow and verification.
- `playwright.config.js`: Central config for Playwright settings.

## Additional Notes
- Keep test data (usernames, passwords) hardcoded for demo purposes.
- Organize new tests in `tests/` or `e2e/` as appropriate.
- Reports are auto-generated after test runs; check `playwright-report/` for results.

---

For questions or unclear conventions, please ask for clarification or provide feedback to improve these instructions.
