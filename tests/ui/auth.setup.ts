import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { users } from '../../src/data/users';

// Runs once before the UI tests: logs in and saves the session to a file.
setup('login as standard_user', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(users.standard.username, users.standard.password);
  await expect(page).toHaveURL(/inventory/);
  await page.context().storageState({ path: '.auth/standard.json' });
});
