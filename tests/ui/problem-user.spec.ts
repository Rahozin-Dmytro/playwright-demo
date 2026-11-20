import { test, expect } from '../../src/fixtures/ui';
import { users } from '../../src/data/users';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('problem_user', () => {
  test('all product images are the same (known bug) @regression', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(users.problem.username, users.problem.password);
    const srcs = await page.locator('img.inventory_item_img').evaluateAll((imgs) =>
      imgs.map((i) => (i as HTMLImageElement).getAttribute('src')),
    );
    // Документуємо баг: у нормального користувача 6 різних картинок
    expect(new Set(srcs).size).toBe(1);
  });
});
