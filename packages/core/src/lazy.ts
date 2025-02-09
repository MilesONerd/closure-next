/**
 * @fileoverview Lazy loading implementation for Closure Next.
 * @license Apache-2.0
 */

export class Lazy<T> {
  private value: T | undefined;
  private factory: () => Promise<T>;

  constructor(factory: () => Promise<T>) {
    this.factory = factory;
  }

  async get(): Promise<T> {
    if (!this.value) {
      this.value = await this.factory();
    }
    return this.value;
  }

  isLoaded(): boolean {
    return this.value !== undefined;
  }

  reset(): void {
    this.value = undefined;
  }
}
