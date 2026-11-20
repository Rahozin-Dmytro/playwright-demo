import { test, expect } from '../../src/fixtures/ui';
import { users } from '../../src/data/users';

// Логін-тести стартують без збереженої сесії
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test('standard user can log in @smoke', async ({ loginPage, inventoryPage, page }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory/);
    await inventoryPage.expectLoaded();
  });

  test('locked out user sees error @regression', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.locked.username, users.locked.password);
    await loginPage.expectError('this user has been locked out');
  });

  test('wrong password shows error @regression', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, 'wrong');
    await loginPage.expectError('do not match');
  });

  test('empty username shows error @regression', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('', users.standard.password);
    await loginPage.expectError('Username is required');
  });

  test('inventory is not accessible without login @regression', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await expect(page).toHaveURL('/');
    await loginPage.expectError("You can only access '/inventory.html' when you are logged in");
  });
});
