/**
 * @fileoverview Object utilities for Closure Next.
 * @license Apache-2.0
 */

/**
 * Gets a value from an object by key
 */
export function get<T>(obj: {[key: string]: T}, key: string): T | undefined {
  return obj[key];
}

/**
 * Sets a value in an object, throwing if the key already exists
 */
export function add<T>(obj: {[key: string]: T}, key: string, value: T): void {
  if (key in obj) {
    throw new Error(`Key "${key}" already exists`);
  }
  obj[key] = value;
}

/**
 * Removes a key from an object
 */
export function remove(obj: {[key: string]: unknown}, key: string): boolean {
  if (key in obj) {
    delete obj[key];
    return true;
  }
  return false;
}

/**
 * Creates a shallow clone of an object
 */
export function clone<T>(obj: T): T {
  return Array.isArray(obj)
    ? [...obj] as unknown as T
    : { ...obj };
}
