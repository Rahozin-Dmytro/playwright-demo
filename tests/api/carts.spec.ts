import { test, expect } from '../../src/fixtures/api';

// dummyjson симулює зміни: PUT/DELETE повертають результат, але нічого не зберігають.
test.describe('Carts API', () => {
  test('get cart by id @smoke', async ({ request }) => {
    const response = await request.get('/carts/1');
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.id).toBe(1);
    expect(body.products.length).toBeGreaterThan(0);
  });

  test('add new cart @regression', async ({ request }) => {
    const response = await request.post('/carts/add', {
      data: { userId: 1, products: [{ id: 1, quantity: 2 }] },
    });
    const body = await response.json();

    expect(response.status()).toBe(201);
    expect(body.userId).toBe(1);
    expect(body.totalQuantity).toBe(2);
    expect(body.products[0]).toMatchObject({ id: 1, quantity: 2 });
  });

  test('update cart @regression', async ({ request }) => {
    const response = await request.put('/carts/1', {
      data: { merge: true, products: [{ id: 1, quantity: 5 }] },
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    const updated = body.products.find((p: { id: number }) => p.id === 1);
    expect(updated.quantity).toBe(5);
  });

  test('delete cart @regression', async ({ request }) => {
    const response = await request.delete('/carts/1');
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.isDeleted).toBe(true);
    expect(body).toHaveProperty('deletedOn');
  });
});
