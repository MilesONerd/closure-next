/**
 * @fileoverview Object utilities for Closure Next.
 * @license Apache-2.0
 */
/**
 * Gets a value from an object by key
 */
export declare function get<T>(obj: {
    [key: string]: T;
}, key: string): T | undefined;
/**
 * Sets a value in an object, throwing if the key already exists
 */
export declare function add<T>(obj: {
    [key: string]: T;
}, key: string, value: T): void;
/**
 * Removes a key from an object
 */
export declare function remove(obj: {
    [key: string]: unknown;
}, key: string): boolean;
/**
 * Creates a shallow clone of an object
 */
export declare function clone<T>(obj: T): T;
//# sourceMappingURL=object.d.ts.map
