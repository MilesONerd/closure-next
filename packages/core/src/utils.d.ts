/**
 * @fileoverview Utility functions for Closure Next.
 * @license Apache-2.0
 */
/**
 * Type checking utilities
 */
export declare function isString(value: unknown): value is string;
export declare function isNumber(value: unknown): value is number;
export declare function isBoolean(value: unknown): value is boolean;
export declare function isObject(value: unknown): value is object;
export declare function isArray(value: unknown): value is unknown[];
export declare function isFunction(value: unknown): value is Function;
export declare function isElement(value: unknown): value is HTMLElement;
/**
 * DOM utilities
 */
export declare function addClass(element: HTMLElement, className: string): void;
export declare function removeClass(element: HTMLElement, className: string): void;
export declare function hasClass(element: HTMLElement, className: string): boolean;
export declare function toggleClass(element: HTMLElement, className: string): void;
/**
 * Object utilities
 */
export declare function isEmpty(value: unknown): boolean;
export declare function deepClone<T>(obj: T): T;
/**
 * String utilities
 */
export declare function camelToKebab(str: string): string;
export declare function kebabToCamel(str: string): string;
//# sourceMappingURL=utils.d.ts.map