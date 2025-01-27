/**
 * @fileoverview ID generation utilities for Closure Next.
 * @license Apache-2.0
 */
/**
 * Generates unique IDs for components
 */
export declare class IdGenerator {
    private static instance;
    private counter;
    private constructor();
    /**
     * Gets the singleton instance
     */
    static getInstance(): IdGenerator;
    /**
     * Gets the next unique ID
     */
    getNextUniqueId(): string;
}
//# sourceMappingURL=id.d.ts.map
