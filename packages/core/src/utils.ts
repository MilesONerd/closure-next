/**
 * @fileoverview Utility functions for Closure Next.
 * @license Apache-2.0
 */

/**
 * Type checking utilities
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

export function isElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement;
}

/**
 * DOM utilities
 */
export function addClass(element: HTMLElement, className: string): void {
  element.classList.add(className);
}

export function removeClass(element: HTMLElement, className: string): void {
  element.classList.remove(className);
}

export function hasClass(element: HTMLElement, className: string): boolean {
  return element.classList.contains(className);
}

export function toggleClass(element: HTMLElement, className: string): void {
  element.classList.toggle(className);
}

/**
 * Object utilities
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (isArray(value)) return value.length === 0;
  if (isObject(value)) return Object.keys(value).length === 0;
  if (isString(value)) return value.length === 0;
  return false;
}

export function deepClone<T>(obj: T): T {
  if (!isObject(obj)) return obj;
  if (Array.isArray(obj)) return obj.map(deepClone) as unknown as T;
  return Object.fromEntries(
    Object.entries(obj as object).map(([k, v]) => [k, deepClone(v)])
  ) as T;
}

/**
 * String utilities
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
