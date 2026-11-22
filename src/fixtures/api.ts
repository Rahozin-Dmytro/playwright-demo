import { test as base, expect, APIRequestContext } from '@playwright/test';
import { apiUser } from '../data/users';

type TestFixtures = {
  authApi: APIRequestContext;
};

type WorkerFixtures = {
  authToken: string;
};

// authToken: worker-scoped, so login runs once per worker instead of once per test.
//   The built-in `request` and `baseURL` fixtures are test-scoped and cannot be used
//   here, so a separate request context is created from the project's config.
// authApi: test-scoped API client that already sends the Authorization header.
export const test = base.extend<TestFixtures, WorkerFixtures>({
  authToken: [
    async ({ playwright }, use, workerInfo) => {
      const ctx = await playwright.request.newContext({
        baseURL: workerInfo.project.use.baseURL,
      });
      const res = await ctx.post('/auth/login', { data: apiUser });
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      await ctx.dispose();
      await use(body.accessToken);
    },
    { scope: 'worker' },
  ],
  authApi: async ({ playwright, authToken, baseURL }, use) => {
    const ctx = await playwright.request.newContext({
      baseURL,
      extraHTTPHeaders: { Authorization: `Bearer ${authToken}` },
    });
    await use(ctx);
    await ctx.dispose();
  },
});

export { expect };
