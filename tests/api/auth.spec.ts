import { test, expect } from '../../src/fixtures/api';
import { apiUser } from '../../src/data/users';

// Fixtures: request (plain client), authToken (worker-scoped token), authApi (client with token)

test.describe('Auth API', () => {
  test('login with valid credentials returns token @smoke', async ({ request }) => {
    const response = await request.post('/auth/login', { data: apiUser });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(typeof body.accessToken).toBe('string');
    expect(body.accessToken).toBeTruthy();
  });

  test('login with wrong password returns 400 @regression', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: { username: apiUser.username, password: 'wrong' },
    });
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.message).toBe('Invalid credentials');
    expect(body).not.toHaveProperty('accessToken');
  });

  test('GET /auth/me with token returns current user @smoke', async ({ authApi }) => {
    const response = await authApi.get('/auth/me');
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.username).toBe(apiUser.username);
    expect(body).toHaveProperty('email');
  });

  test('GET /auth/me without token returns 401 @regression', async ({ request }) => {
    const response = await request.get('/auth/me');
    const body = await response.json();

    expect(response.status()).toBe(401);
    expect(body.message).toBe('Access Token is required');
  });
});
