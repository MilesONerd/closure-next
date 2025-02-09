/**
 * @fileoverview Bundle implementation for Closure Next.
 * @license Apache-2.0
 */
export class Bundle {
    constructor() {
        this.modules = new Map();
        this.loaded = false;
    }
    async load() {
        if (this.loaded) {
            return;
        }
        this.loaded = true;
    }
    async unload() {
        if (!this.loaded) {
            return;
        }
        this.modules.clear();
        this.loaded = false;
    }
    isLoaded() {
        return this.loaded;
    }
    async getModule(name) {
        if (!this.loaded) {
            throw new Error('Bundle not loaded');
        }
        const module = this.modules.get(name);
        if (!module) {
            throw new Error(`Module ${name} not found`);
        }
        return module;
    }
    hasModule(name) {
        return this.modules.has(name);
    }
}
//# sourceMappingURL=bundle.js.map