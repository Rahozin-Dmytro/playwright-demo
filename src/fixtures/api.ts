import { test as base, expect, APIRequestContext } from '@playwright/test';

type ApiFixtures = {
  authToken: string;
  authApi: APIRequestContext;
};

// authToken: логіниться один раз на тест і віддає accessToken.
// authApi: API-клієнт, який уже має заголовок Authorization.
export const test = base.extend<ApiFixtures>({
  authToken: async ({ request }, use) => {
    const res = await request.post('/auth/login', {
      data: { username: 'emilys', password: 'emilyspass' },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    await use(body.accessToken);
  },
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
