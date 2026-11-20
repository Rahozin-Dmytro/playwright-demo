import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { users } from '../../src/data/users';

// Запускається один раз перед UI-тестами: логіниться і зберігає cookies у файл.
setup('login as standard_user', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(users.standard.username, users.standard.password);
  await expect(page).toHaveURL(/inventory/);
  await page.context().storageState({ path: '.auth/standard.json' });
});
