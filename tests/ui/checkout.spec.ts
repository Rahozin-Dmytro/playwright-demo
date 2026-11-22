import { test, expect } from '../../src/fixtures/ui';
import { checkoutInfo } from '../../src/data/users';

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();
  });

  test('complete purchase @smoke', async ({ checkoutPage }) => {
    await checkoutPage.fillInfo(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
    await checkoutPage.finish();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('first name is required @regression', async ({ checkoutPage }) => {
    await checkoutPage.fillInfo('', checkoutInfo.lastName, checkoutInfo.postalCode);
    await expect(checkoutPage.error).toContainText('First Name is required');
  });

  test('last name is required @regression', async ({ checkoutPage }) => {
    await checkoutPage.fillInfo(checkoutInfo.firstName, '', checkoutInfo.postalCode);
    await expect(checkoutPage.error).toContainText('Last Name is required');
  });

  test('postal code is required @regression', async ({ checkoutPage }) => {
    await checkoutPage.fillInfo(checkoutInfo.firstName, checkoutInfo.lastName, '');
    await expect(checkoutPage.error).toContainText('Postal Code is required');
  });
});
