/**
 * @fileoverview String utilities for Closure Next.
 * @license Apache-2.0
 */

/**
 * Converts a string to camelCase
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^[A-Z]/, c => c.toLowerCase());
}

/**
 * Converts a string to PascalCase
 */
export function toPascalCase(str: string): string {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

/**
 * Compares two strings case-insensitively
 */
export function compareIgnoreCase(str1: string, str2: string): number {
  return str1.toLowerCase().localeCompare(str2.toLowerCase());
}

/**
 * HTML-escapes a string
 */
export function htmlEscape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Checks if a string contains another string, case-insensitively
 */
export function containsIgnoreCase(str: string, substr: string): boolean {
  return str.toLowerCase().includes(substr.toLowerCase());
}
