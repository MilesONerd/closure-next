/**
 * @fileoverview Lazy loading implementation for Closure Next.
 * @license Apache-2.0
 */
export class Lazy {
    constructor(factory) {
        this.factory = factory;
    }
    async get() {
        if (!this.value) {
            this.value = await this.factory();
        }
        return this.value;
    }
    isLoaded() {
        return this.value !== undefined;
    }
    reset() {
        this.value = undefined;
    }
}
//# sourceMappingURL=lazy.js.map