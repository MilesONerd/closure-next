/**
 * @fileoverview Deno compatibility layer for Closure Next.
 * @license Apache-2.0
 */

export {
  Component,
  ComponentState,
  ComponentEventType,
  EventTarget,
  DomHelper,
  utils
} from '@closure-next/core';

// Deno-specific utilities
export function createDenoElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

export function querySelector(selector: string): Element | null {
  return document.querySelector(selector);
}

export function querySelectorAll(selector: string): Element[] {
  return Array.from(document.querySelectorAll(selector));
}

// Deno runtime detection
export const isDeno = typeof Deno !== 'undefined';

// ESM-specific exports
export default {
  createDenoElement,
  querySelector,
  querySelectorAll,
  isDeno
};
