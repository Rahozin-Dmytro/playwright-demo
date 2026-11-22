import { test, expect } from '../../src/fixtures/api';

test.describe('Products API', () => {
  test('get products list @smoke', async ({ request }) => {
    const response = await request.get('/products');
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products).toHaveLength(30); // default limit
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
    // every result must mention "phone" in its title/description/category/tags
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

  test('pagination with limit and skip @regression', async ({ request }) => {
    const response = await request.get('/products', { params: { limit: 5, skip: 10 } });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.products).toHaveLength(5);
    expect(body.limit).toBe(5);
    expect(body.skip).toBe(10);
  });

  test('get categories list @regression', async ({ request }) => {
    const response = await request.get('/products/category-list');
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body).toContain('smartphones');
  });

  test('get products by category @regression', async ({ request }) => {
    const response = await request.get('/products/category/smartphones');
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.products.length).toBeGreaterThan(0);
    for (const p of body.products) {
      expect(p.category).toBe('smartphones');
    }
  });

  test('update product (CRUD: update) @regression', async ({ request }) => {
    const response = await request.put('/products/1', { data: { title: 'Updated Title' } });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.id).toBe(1);
    expect(body.title).toBe('Updated Title');
  });

  test('delete product (CRUD: delete) @regression', async ({ request }) => {
    const response = await request.delete('/products/1');
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.id).toBe(1);
    expect(body.isDeleted).toBe(true);
    expect(body).toHaveProperty('deletedOn');
  });
});
