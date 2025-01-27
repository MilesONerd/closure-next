/**
 * @fileoverview ID generation utilities for Closure Next.
 * @license Apache-2.0
 */
/**
 * Generates unique IDs for components
 */
export class IdGenerator {
    constructor() {
        this.counter = 0;
    }
    /**
     * Gets the singleton instance
     */
    static getInstance() {
        if (!IdGenerator.instance) {
            IdGenerator.instance = new IdGenerator();
        }
        return IdGenerator.instance;
    }
    /**
     * Gets the next unique ID
     */
    getNextUniqueId() {
        return `closure-next-${++this.counter}`;
    }
}
//# sourceMappingURL=id.js.map
