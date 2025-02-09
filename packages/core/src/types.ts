/**
 * @fileoverview Type definitions for Closure Next core functionality.
 * @license Apache-2.0
 */

import { Component } from './component';

/**
 * Generic component props type
 */
export interface ComponentProps<T = unknown> {
  [key: string]: T;
}

/**
 * Generic component state type
 */
export interface ComponentState<T = unknown> {
  [key: string]: T;
}

/**
 * Event handler type with proper 'this' binding
 */
export type EventHandler<T = Event> = (this: Component, event: T) => void;

/**
 * Component event options
 */
export interface ComponentEventOptions {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
  detail?: unknown;
}

/**
 * Component event types with proper typing
 */
export type ComponentEventMap = {
  beforeshow: CustomEvent<void>;
  show: CustomEvent<void>;
  hide: CustomEvent<void>;
  disable: CustomEvent<void>;
  enable: CustomEvent<void>;
  highlight: CustomEvent<void>;
  unhighlight: CustomEvent<void>;
  activate: CustomEvent<void>;
  deactivate: CustomEvent<void>;
  select: CustomEvent<void>;
  unselect: CustomEvent<void>;
  check: CustomEvent<void>;
  uncheck: CustomEvent<void>;
  focus: FocusEvent;
  blur: FocusEvent;
  open: CustomEvent<void>;
  close: CustomEvent<void>;
  enter: CustomEvent<void>;
  leave: CustomEvent<void>;
  action: CustomEvent<unknown>;
  change: CustomEvent<unknown>;
  [key: string]: Event;
};

/**
 * Component lifecycle hooks
 */
export interface ComponentLifecycle {
  onInit?(): void | Promise<void>;
  onDestroy?(): void | Promise<void>;
  onBeforeRender?(): void | Promise<void>;
  onAfterRender?(): void | Promise<void>;
  onEnterDocument?(): void | Promise<void>;
  onExitDocument?(): void | Promise<void>;
}

/**
 * Server-side rendering options
 */
export interface SSROptions {
  hydration?: 'client-only' | 'server-first' | 'progressive';
  ssr?: boolean;
  state?: Record<string, unknown>;
}
