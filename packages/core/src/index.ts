/**
 * @fileoverview Entry point for Closure Next core functionality.
 * @license Apache-2.0
 */

// Export base classes and utilities
export { Component } from './component';
export { DomHelper } from './dom';
export { EventTarget } from './events';
export { IdGenerator } from './id';

// Export component types and interfaces
export { ComponentState, ComponentEventType } from './component';
export type { ComponentInterface, ComponentConstructor } from './component';

// Export SSR-specific types and utilities
export type { SSROptions } from './server';
export { renderToString, hydrateComponent } from './server';

// Export utility functions
export * from './utils';
