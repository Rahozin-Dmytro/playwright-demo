import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly itemImages: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sort: Locator;

  constructor(private page: Page) {
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.itemImages = page.locator('img.inventory_item_img');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.sort = page.getByTestId('product-sort-container');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  async addToCart(slug: string) {
    await this.page.getByTestId(`add-to-cart-${slug}`).click();
  }

  async removeFromCart(slug: string) {
    await this.page.getByTestId(`remove-${slug}`).click();
  }

  async sortBy(value: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sort.selectOption(value);
  }

  async prices(): Promise<number[]> {
    const texts = await this.page.getByTestId('inventory-item-price').allTextContents();
    return texts.map((t) => Number(t.replace('$', '')));
  }

  async names(): Promise<string[]> {
    return this.page.getByTestId('inventory-item-name').allTextContents();
  }

  async imageSources(): Promise<(string | null)[]> {
    return this.itemImages.evaluateAll((imgs) => imgs.map((i) => i.getAttribute('src')));
  }

  async openCart() {
    await this.cartLink.click();
  }
}
