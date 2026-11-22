import { test, expect } from '../../src/fixtures/ui';
import { users } from '../../src/data/users';

// Login tests start without a saved session
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test('standard user can log in @smoke', async ({ loginPage, inventoryPage, page }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('locked out user sees error @regression', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.locked.username, users.locked.password);
    await expect(loginPage.error).toContainText('this user has been locked out');
  });

  test('wrong password shows error @regression', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, 'wrong');
    await expect(loginPage.error).toContainText('do not match');
  });

  test('empty username shows error @regression', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('', users.standard.password);
    await expect(loginPage.error).toContainText('Username is required');
  });

  test('inventory is not accessible without login @regression', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await expect(page).toHaveURL('/');
    await expect(loginPage.error).toContainText("You can only access '/inventory.html' when you are logged in");
  });
});
