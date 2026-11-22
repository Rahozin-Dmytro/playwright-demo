import { test, expect } from '../../src/fixtures/ui';
import { users } from '../../src/data/users';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('problem_user', () => {
  // Known bug: problem_user sees the same image for every product.
  // The test asserts the CORRECT behaviour and is marked as expected to fail.
  // When the bug is fixed, the test "unexpectedly passes" and fails the run,
  // signalling that test.fail() should be removed.
  test('each product has its own image @regression', async ({ loginPage, inventoryPage }) => {
    test.fail(true, 'Known bug: problem_user gets identical product images');
    test.info().annotations.push({
      type: 'issue',
      description: 'saucedemo problem_user: all inventory images are the same',
    });

    await loginPage.goto();
    await loginPage.login(users.problem.username, users.problem.password);
    await expect(inventoryPage.items).toHaveCount(6);

    const srcs = await inventoryPage.imageSources();
    expect(new Set(srcs).size).toBe(6);
  });
});
