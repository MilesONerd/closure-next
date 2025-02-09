/**
 * @fileoverview Bundle implementation for Closure Next.
 * @license Apache-2.0
 */

import { BundleInterface } from './types';

export class Bundle implements BundleInterface {
  private modules: Map<string, any>;
  private loaded: boolean;

  constructor() {
    this.modules = new Map();
    this.loaded = false;
  }

  async load(): Promise<void> {
    if (this.loaded) {
      return;
    }
    this.loaded = true;
  }

  async unload(): Promise<void> {
    if (!this.loaded) {
      return;
    }
    this.modules.clear();
    this.loaded = false;
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  async getModule<T>(name: string): Promise<T> {
    if (!this.loaded) {
      throw new Error('Bundle not loaded');
    }
    const module = this.modules.get(name);
    if (!module) {
      throw new Error(`Module ${name} not found`);
    }
    return module;
  }

  hasModule(name: string): boolean {
    return this.modules.has(name);
  }
}
