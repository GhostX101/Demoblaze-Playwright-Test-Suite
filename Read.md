# Demoblaze Playwright Automation

**Author:** Solomon Ikporo

This project checks the main customer journeys on the [Demoblaze Product Store](https://www.demoblaze.com/). It uses Playwright Test with page objects, JSON test data, and browser alerts as part of the assertions.

## What is covered

- Homepage URL, carousel controls, category links, navigation links, and footer contact content
- Login with valid credentials
- Login failures for an invalid password and an unknown username
- Visible product catalogue content for Phones, Laptops, and Monitors
- Category filtering and product detail matching
- Add-to-cart confirmation alert
- Signup success, duplicate usernames, incomplete forms, modal closing, and password masking

Signup tests create timestamped usernames so repeated runs do not reuse the same account.

## Project layout

```text
fixtures/                 Test data for login and signup
page/                     Page object classes and selectors
tests/                    Playwright test specifications
playwright.config.js      Browser projects and shared Playwright settings
.github/workflows/        GitHub Actions workflow
playwright-report/        Generated HTML report after a test run
test-results/             Generated test artifacts
```

### Page objects

- `page/Home.js` contains homepage navigation and content selectors.
- `page/login.js` contains login modal fields and actions.
- `page/product.js` contains catalogue, category, product detail, and cart selectors.
- `page/signup.js` contains signup modal fields and controls.

### Test data

- `fixtures/login.json` contains the valid account and deliberately invalid login values.
- `fixtures/signup.json` contains the signup password and username prefix.

## Requirements

- Node.js LTS
- npm
- Playwright browsers
- Internet access, because the tests use the public Demoblaze site

## Install

From the project folder:

```bash
npm install
npx playwright install
```

For Linux CI environments, install the browser system dependencies as well:

```bash
npx playwright install --with-deps
```

## Run the tests

Run the complete suite in all configured browsers:

```bash
npx playwright test
```

Run one specification:

```bash
npx playwright test tests/product.spec.js
```

Run only Chromium:

```bash
npx playwright test --project=chromium
```

Run with the visible browser window:

```bash
npx playwright test --headed
```

The project does not define npm test scripts, so use the Playwright CLI commands above.

## Reports and debugging

The configured reporter is HTML. After a run, open the report with:

```bash
npx playwright show-report
```

A trace is collected on the first retry. When a test fails, the HTML report and `test-results/` directory contain the available evidence.

## Browser configuration

`playwright.config.js` runs desktop tests in:

- Chromium
- Firefox
- WebKit

Tests run in parallel locally. On CI, retries are enabled and workers are reduced to one. The GitHub Actions workflow runs on pushes and pull requests targeting `main` or `master`, then stores the HTML report for 30 days.

## Useful maintenance notes

- The test site is external, so product data, alerts, and availability can change independently of this repository.
- Login tests depend on the `Ghost101` account in `fixtures/login.json` remaining available on Demoblaze.
- Signup tests modify the shared demo site's user database by creating temporary users.
- Keep `playwright-report/` and `test-results/` out of commits; they are already ignored by `.gitignore`.
