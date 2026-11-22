# Playwright Demo: UI + API test automation

[![Playwright Tests](https://github.com/Rahozin-Dmytro/playwright-demo/actions/workflows/playwright.yml/badge.svg)](https://github.com/Rahozin-Dmytro/playwright-demo/actions/workflows/playwright.yml)

End-to-end test automation project built with **Playwright + TypeScript**, run in CI with both **GitHub Actions** and **Jenkins** (in Docker).

It tests two public practice sites, so anyone can clone and run it without credentials or setup:

| Layer | Target | What is covered |
|---|---|---|
| UI | [saucedemo.com](https://www.saucedemo.com) | Login (incl. locked-out and problem users), inventory sorting, cart, checkout |
| API | [dummyjson.com](https://dummyjson.com) | Auth with token, products (list, search, pagination, categories, 404, CRUD), carts (CRUD) |

## Tech stack

- Playwright Test, TypeScript
- Page Object Model, custom fixtures
- Test tags: `@smoke` / `@regression`
- Reports: HTML (Playwright) and JUnit XML (for Jenkins)
- CI: GitHub Actions, Jenkins (Docker)

## Project structure

```
playwright-demo/
├── tests/
│   ├── ui/                 login, inventory, cart, checkout, problem_user, auth.setup
│   └── api/                auth, products, carts
├── src/
│   ├── pages/              LoginPage, InventoryPage, CartPage, CheckoutPage
│   ├── fixtures/           ui.ts (page objects), api.ts (auth token + API client)
│   └── data/               test users and checkout data
├── jenkins/                Dockerfile + docker-compose for a local Jenkins
├── Jenkinsfile             Jenkins pipeline
├── .github/workflows/      GitHub Actions pipeline
└── playwright.config.ts
```

## Key design decisions

- **Page Object Model.** Selectors live in `src/pages`, tests only describe behaviour. If a locator changes, it is fixed in one place.
- **Fixtures.** `src/fixtures/ui.ts` provides ready page objects; `src/fixtures/api.ts` provides `authToken` and an authorized `authApi` client, so tests contain no login boilerplate.
- **Login once via `storageState`.** `tests/ui/auth.setup.ts` logs in a single time and saves the session to `.auth/`. The other UI tests start already logged in; the login tests reset the state explicitly.
- **Separate projects.** `setup`, `ui` and `api` are defined in `playwright.config.ts` with their own `baseURL`, so tests use short paths like `/products/1`.
- **Stable selectors.** saucedemo uses `data-test` attributes, so `testIdAttribute` is set to `data-test` and tests use `getByTestId`.

## Getting started

Requirements: Node.js 20+.

```bash
npm ci
npx playwright install chromium
```

Run all tests (UI + API):

```bash
npx playwright test
```

Useful variations:

```bash
npx playwright test --project=api          # API only
npx playwright test --project=ui           # UI only
npx playwright test --grep @smoke          # smoke subset
npx playwright test --headed --project=ui  # watch the browser
npx playwright show-report                 # open the last HTML report
```

## Test counts

- 15 UI tests and 18 API tests, plus one auth setup step (34 in a full run)
- 9 tagged `@smoke`, 24 tagged `@regression`

## CI

### GitHub Actions

`.github/workflows/playwright.yml` runs on every push and pull request to `main`: checkout, install dependencies and browsers, run all tests, upload the HTML report as an artifact.

### Jenkins (local, in Docker)

`jenkins/` contains an image with Jenkins, Node.js and Chromium preinstalled.

```bash
cd jenkins
docker compose up -d --build
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword   # first login
```

Open http://localhost:8080, install the suggested plugins, then create a **Pipeline** job:

- Definition: **Pipeline script from SCM**
- SCM: Git, repository URL of this repo
- Branch: `*/main`, Script Path: `Jenkinsfile`

The pipeline (`Jenkinsfile`) runs `npm ci` and `npx playwright test`, then publishes JUnit results (Test Result tab) and the Playwright HTML report.

> The compose file disables Jenkins' Content-Security-Policy for HTML reports so the Playwright report renders. This is intended for local learning only.

## Notes

- Both target sites are public demo services. dummyjson only simulates writes (POST/PUT/DELETE return a result but do not persist data), which the API tests account for.
- Some assertions depend on demo data (for example, 30 products per page by default) and may need updating if the sites change.
