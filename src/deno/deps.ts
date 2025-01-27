/**
 * @fileoverview External dependencies for Deno integration.
 * @license Apache-2.0
 */

// Re-export core functionality
export {
  Component,
  ComponentState,
  ComponentEventType,
  EventTarget,
  DomHelper,
  utils
} from '@closure-next/core';

// Re-export Deno-specific functionality
export * from './mod';
