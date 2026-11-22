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
- Page Object Model, custom fixtures (test- and worker-scoped)
- Strict TypeScript type check in CI (`tsc --noEmit`)
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
│   └── data/               UI/API test users and checkout data
├── jenkins/                Dockerfile + docker-compose for a local Jenkins
├── Jenkinsfile             Jenkins pipeline
├── .github/workflows/      GitHub Actions pipeline
├── playwright.config.ts
└── tsconfig.json
```

## Key design decisions

- **Page Object Model without assertions.** Page objects in `src/pages` hold locators and actions only; all `expect` calls live in the tests. If a locator changes, it is fixed in one place, and each test shows what it verifies.
- **Fixtures.** `src/fixtures/ui.ts` provides ready page objects; `src/fixtures/api.ts` provides an authorized `authApi` client, so tests contain no login boilerplate.
- **API login once per worker.** `authToken` is a worker-scoped fixture: the token is fetched once per worker and reused by every API test, instead of logging in before each test.
- **Known bugs are explicit.** The `problem_user` test asserts the correct behaviour (six different product images) and is marked `test.fail()`. The report shows the known bug, and once it is fixed the test starts failing as a signal to remove the annotation.
- **Login once via `storageState`.** `tests/ui/auth.setup.ts` logs in a single time and saves the session to `.auth/`. The other UI tests start already logged in; the login tests reset the state explicitly.
- **Separate projects.** `setup`, `ui` and `api` are defined in `playwright.config.ts` with their own `baseURL` (overridable via `UI_BASE_URL` / `API_BASE_URL`), so tests use short paths like `/products/1`.
- **Test data in one place.** UI users and the dummyjson credentials live in `src/data/users.ts`; the API credentials can be overridden via `API_USERNAME` / `API_PASSWORD`.
- **Stable selectors.** saucedemo uses `data-test` attributes, so `testIdAttribute` is set to `data-test` and tests use `getByTestId`.

## Getting started

Requirements: Node.js 22 (see `.nvmrc`).

```bash
npm ci
npx playwright install chromium
```

Run all tests (UI + API):

```bash
npm test
```

Scripts:

```bash
npm run test:api          # API only
npm run test:ui           # UI only
npm run test:smoke        # @smoke subset
npm run test:regression   # @regression subset
npm run test:headed       # UI tests with a visible browser
npm run report            # open the last HTML report
npm run typecheck         # TypeScript type check
```

## Test counts

- 16 UI tests and 18 API tests, plus one auth setup step (35 in a full run)
- 9 tagged `@smoke`, 25 tagged `@regression`
- 1 test marked as an expected failure (known `problem_user` bug)

## CI

### GitHub Actions

`.github/workflows/playwright.yml` runs on every push and pull request to `main`: install dependencies, type check, install Chromium, run all tests, then upload the HTML report and `test-results/` (JUnit XML, traces) as artifacts.

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

The pipeline (`Jenkinsfile`) runs `npm ci`, the type check and the tests, then publishes JUnit results (Test Result tab), the Playwright HTML report and archives `test-results/` (traces and screenshots of failures).

Use **Build with Parameters** to pick a suite: `all`, `smoke`, `regression`, `ui` or `api`. On the very first build the parameter is not registered yet, so the job runs `all`.

> The Playwright version in `jenkins/Dockerfile` must match `@playwright/test` in `package.json` (pinned exactly, without `^`). After upgrading Playwright, rebuild the image with `docker compose up -d --build`.

> The compose file disables Jenkins' Content-Security-Policy for HTML reports so the Playwright report renders. This is intended for local learning only.

## Notes

- Both target sites are public demo services. dummyjson only simulates writes (POST/PUT/DELETE return a result but do not persist data), which the API tests account for.
- Some assertions depend on demo data (for example, 30 products per page by default) and may need updating if the sites change.
