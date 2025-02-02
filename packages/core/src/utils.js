/**
 * @fileoverview Utility functions for Closure Next.
 * @license Apache-2.0
 */
/**
 * Type checking utilities
 */
export function isString(value) {
    return typeof value === 'string';
}
export function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}
export function isBoolean(value) {
    return typeof value === 'boolean';
}
export function isObject(value) {
    return typeof value === 'object' && value !== null;
}
export function isArray(value) {
    return Array.isArray(value);
}
export function isFunction(value) {
    return typeof value === 'function';
}
export function isElement(value) {
    return value instanceof HTMLElement;
}
/**
 * DOM utilities
 */
export function addClass(element, className) {
    element.classList.add(className);
}
export function removeClass(element, className) {
    element.classList.remove(className);
}
export function hasClass(element, className) {
    return element.classList.contains(className);
}
export function toggleClass(element, className) {
    element.classList.toggle(className);
}
/**
 * Object utilities
 */
export function isEmpty(value) {
    if (value === null || value === undefined)
        return true;
    if (isArray(value))
        return value.length === 0;
    if (isObject(value))
        return Object.keys(value).length === 0;
    if (isString(value))
        return value.length === 0;
    return false;
}
export function deepClone(obj) {
    if (!isObject(obj))
        return obj;
    if (Array.isArray(obj))
        return obj.map(deepClone);
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, deepClone(v)]));
}
/**
 * String utilities
 */
export function camelToKebab(str) {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}
export function kebabToCamel(str) {
    return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
//# sourceMappingURL=utils.js.map