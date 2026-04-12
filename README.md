# E2E UI Test Automation - Sauce Demo

## Overview
This project contains end-to-end UI tests for [Sauce Demo](https://www.saucedemo.com), a public e-commerce demo application. Tests are written using Cypress with the Page Object Model pattern.

---

## Tech Stack
- Cypress 15.13.1
- Node v24.14.1
- JavaScript

---

## Project Structure

```
cypress/
├── e2e/
│   └── smokeTest.cy.js       # Test scenarios
├── fixtures/
│   └── data.json             # Test data
├── pages/
│   ├── ProductListingPage.js
│   ├── ProductDescPage.js
│   ├── CartPage.js
│   ├── CheckoutPage.js
│   └── OrderConfirmation.js
├── support/
│   ├── commands.js           # Custom Cypress commands
│   └── e2e.js
cypress.config.js
package.json
```

---

## Setup

1. Clone the repository
```bash
git clone <repo-url>
cd e2e-tests
```

2. Install dependencies
```bash
npm install
```

---

## Running Tests

Headless mode
```bash
npm test
```

Headed mode
```bash
npm run test:headed
```

---

## Test Scenarios

| Test | Description |
|------|-------------|
| To test successful user journey | Login → select product → add to cart → checkout → order confirmation |
| To test unsuccessful login | Locked out user gets appropriate error message |
| To test user journey with missing checkout details | Form validation when required fields are empty |
| To test user journey with failed checkout | Error user encounters backend failure on placing order |
| To test performance glitches in user journey with slow load | Slow login handled with extended timeout |
| Should not allow checkout with empty cart — known bug | App incorrectly allows checkout with empty cart resulting in $0 order. No validation prevents this |

---

## Approach

### Page Object Model
Each page has its own class under `cypress/pages`. Each class contains 
only the interactions and assertions for that page. If a selector changes 
you only update it in one place rather than hunting through test files.

### Custom Commands
`cy.login()` is defined in `support/commands.js` and interacts directly 
with the login page selectors. It handles navigation and credential input 
in one place making it reusable across any spec file without duplicating 
login steps.

### Test Data
All test data lives in `cypress/fixtures/data.json` and is loaded via 
`cy.fixture()` in `beforeEach`. Credentials, product details and checkout 
data are all kept separate from test logic so updates are made in one place.

```json
{
    "validUser": {},
    "invalidUser": {},
    "errorUser": {},
    "performanceGlitchUser": {},
    "problemUser": {},
    "product": {},
    "checkout": {}
}
```

---

## CI/CD Integration

Tests are designed to run in headless mode making them straightforward 
to plug into any CI/CD pipeline. A GitHub Actions example:

```yaml
name: Cypress Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm test
```

---

## Code Quality
ESLint and Prettier are configured for consistent formatting and catching 
code issues. Config files are included in the repo root.

```bash
npm run lint
npm run format
```

---

## Assumptions

**Base URL** — Tests use `https://www.saucedemo.com`. The `www` prefix 
is required as the non-www version returns a 301 redirect which Cypress 
treats as a failure by default.

**Credentials** — Standard Sauce Demo credentials are used as documented 
on the site. `standard_user` is the primary happy path user.

**Test data** — Sauce Demo does not persist state between sessions so 
each test starts clean with no teardown needed.

---

## Challenges

**cy.session() complexity**
Initially tried using `cy.session()` to cache login state and avoid 
repeated logins. Session validation caused intermittent failures so 
simplified to a `beforeEach` login for reliability. `cy.session()` is 
noted as a future improvement for larger suites.

**error_user frozen field and backend failure**
Found that `error_user` has an intentionally frozen lastName field and 
the checkout POST returns a 503. Handled this with a scoped 
`cy.on('uncaught:exception')` targeting the specific errors rather than 
suppressing all exceptions globally.

**performance_glitch_user slow login**
Observed a significant delay during login for this user type. Handled by 
extending the `cy.url()` assertion timeout rather than using `cy.wait()`.

---

## What I Would Add Given More Time

**Visual regression testing**
`visual_user` has intentional UI misalignment issues. Would implement 
visual regression using `cypress-image-diff` capturing a baseline with 
`standard_user` and comparing against `visual_user` to flag differences.

**cy.session() optimisation**
Re-introduce `cy.session()` with cookie based validation to avoid 
repeated logins across a larger suite.

**Cross browser testing**
Tests currently run against Chrome only. Would extend to Firefox and 
Edge using Cypress built-in cross browser support.

**Cart and product listing tests**
Would add dedicated tests for cart item count, removing items and product 
sorting to improve overall coverage.

---

## Notes
Sauce Demo is a public demo application built with different user types 
to simulate real world scenarios. During exploratory testing an edge case 
was found where the app allows checkout with an empty cart resulting in a 
$0 order — this is documented as a known bug and covered with a dedicated 
test case.