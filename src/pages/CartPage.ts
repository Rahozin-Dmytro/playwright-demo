import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly items: Locator;
  readonly checkoutButton: Locator;
  readonly continueShopping: Locator;

  constructor(private page: Page) {
    this.items = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShopping = page.getByTestId('continue-shopping');
  }

  async expectItemCount(n: number) {
    await expect(this.items).toHaveCount(n);
  }

  async expectHasItem(name: string) {
    await expect(this.page.getByTestId('inventory-item-name').filter({ hasText: name })).toBeVisible();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
