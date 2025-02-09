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
export type {
  ComponentProps,
  ComponentStateType,
  ComponentEventType as ComponentEventTypeEnum,
  ComponentEventMap,
  ComponentConstructor,
  ComponentInterface,
  EventHandler,
  SSROptions
} from './types';

// Export SSR-specific utilities
export { renderToString, hydrateComponent } from './server';

// Export utility functions
export * from './utils';
