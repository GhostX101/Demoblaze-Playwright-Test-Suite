# Demoblaze-Playwright-Test-Suite

[![Playwright Tests](https://img.shields.io/badge/tested%20with-Playwright-45ba4b?logo=playwright)](https://playwright.dev/)
[![Node.js](https://img.shields.io/badge/node-LTS-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

End-to-end tests for the core customer journeys on the [Demoblaze Product Store](https://www.demoblaze.com/), built with **Playwright Test**, the **Page Object Model**, JSON-driven test data, and browser-alert assertions.

---

## Table of contents

- [What's covered](#whats-covered)
- [Project layout](#project-layout)
- [Requirements](#requirements)
- [Install](#install)
- [Running tests](#running-tests)
- [Reports & debugging](#reports--debugging)
- [Browser configuration](#browser-configuration)
- [Maintenance notes](#maintenance-notes)

---

## What's covered

| Area | Coverage |
|---|---|
| **Homepage** | URL, carousel controls, category links, navigation links, footer contact content |
| **Login** | Valid credentials · invalid password · unknown username |
| **Catalogue** | Product content for Phones, Laptops, and Monitors |
| **Category & product detail** | Filtering by category, product detail matching |
| **Signup** | Success, duplicate usernames, incomplete forms, modal closing, password masking |

> **Note:** Signup tests generate timestamped usernames on every run, so repeated executions never collide with an existing account.

---

## Project layout

```text
fixtures/                 Test data for login and signup
page/                      Page object classes and selectors
tests/                     Playwright test specifications
playwright.config.js       Browser projects and shared Playwright settings
.github/workflows/         GitHub Actions workflow
playwright-report/         Generated HTML report after a test run (git-ignored)
test-results/              Generated test artifacts (git-ignored)
```

### Page objects

| File | Responsibility |
|---|---|
| `page/Home.js` | Homepage navigation and content selectors |
| `page/login.js` | Login modal fields and actions |
| `page/product.js` | Catalogue, category, product detail, and cart selectors |
| `page/signup.js` | Signup modal fields and controls |

### Test data

| File | Contents |
|---|---|
| `fixtures/login.json` | Valid account credentials and deliberately invalid login values |
| `fixtures/signup.json` | Signup password and username prefix |

---

## Requirements

- Node.js (LTS)
- npm
- Playwright browsers
- Internet access — tests run against the public Demoblaze site

---

## Install

```bash
npm install
npx playwright install
```

On Linux CI environments, also install browser system dependencies:

```bash
npx playwright install --with-deps
```

---

## Running tests

> There are no npm `test` scripts defined — use the Playwright CLI directly.

| Task | Command |
|---|---|
| Run the full suite (all browsers) | `npx playwright test` |
| Run a single spec | `npx playwright test tests/product.spec.js` |
| Run Chromium only | `npx playwright test --project=chromium` |
| Run headed (visible browser) | `npx playwright test --headed` |

---

## Reports & debugging

The configured reporter is **HTML**. After a run:

```bash
npx playwright show-report
```

A trace is captured on the first retry of a failing test. When a test fails, check the HTML report and the `test-results/` directory for screenshots, traces, and logs.

---

## Browser configuration

`playwright.config.js` runs desktop tests against:

- Chromium
- Firefox
- WebKit

- **Locally:** tests run in parallel.
- **On CI:** retries are enabled and workers are reduced to one.
- The **GitHub Actions** workflow triggers on pushes and pull requests targeting `main` or `master`, and retains the HTML report as an artifact for 30 days.

---

## Maintenance notes

- ⚠️ The test site is external — product data, alerts, and availability can change independently of this repo.
- Login tests depend on the `Ghost101` account (see `fixtures/login.json`) remaining valid on Demoblaze.
- Signup tests write to the shared demo site's user database by creating temporary users.
- `playwright-report/` and `test-results/` are git-ignored — keep generated artifacts out of commits.