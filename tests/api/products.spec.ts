import { test, expect } from '../../src/fixtures/api';

test.describe('Products API', () => {
  test('get products list @smoke', async ({ request }) => {
    const response = await request.get('/products');
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products).toHaveLength(30); // limit за замовчуванням
    expect(body.total).toBeGreaterThan(0);
  });

  test('get single product by id @smoke', async ({ request }) => {
    const response = await request.get('/products/1');
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.id).toBe(1);
    expect(body).toMatchObject({
      title: expect.any(String),
      price: expect.any(Number),
    });
  });

  test('search products by query @regression', async ({ request }) => {
    const response = await request.get('/products/search', { params: { q: 'phone' } });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.products.length).toBeGreaterThan(0);
    // кожен знайдений продукт має мати "phone" у назві/описі/категорії/тегах
    for (const p of body.products) {
      expect(JSON.stringify(p).toLowerCase()).toContain('phone');
    }
  });

  test('non-existing product returns 404 @regression', async ({ request }) => {
    const response = await request.get('/products/99999');
    const body = await response.json();

    expect(response.status()).toBe(404);
    expect(body.message).toContain('not found');
  });

  test('add new product (CRUD: create) @regression', async ({ request }) => {
    const response = await request.post('/products/add', { data: { title: 'My Test Product' } });
    const body = await response.json();

    expect(response.status()).toBe(201);
    expect(body.title).toBe('My Test Product');
    expect(body.id).toEqual(expect.any(Number));
  });
});
