/**
 * @fileoverview Object utilities for Closure Next.
 * @license Apache-2.0
 */
/**
 * Gets a value from an object by key
 */
export function get(obj, key) {
    return obj[key];
}
/**
 * Sets a value in an object, throwing if the key already exists
 */
export function add(obj, key, value) {
    if (key in obj) {
        throw new Error(`Key "${key}" already exists`);
    }
    obj[key] = value;
}
/**
 * Removes a key from an object
 */
export function remove(obj, key) {
    if (key in obj) {
        delete obj[key];
        return true;
    }
    return false;
}
/**
 * Creates a shallow clone of an object
 */
export function clone(obj) {
    return Array.isArray(obj)
        ? [...obj]
        : { ...obj };
}
//# sourceMappingURL=object.js.map
