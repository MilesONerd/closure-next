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
 * Component state type
 */
export type ComponentStateType = {
  ALL: 0xFF;
  DISABLED: 0x01;
  HOVER: 0x02;
  ACTIVE: 0x04;
  SELECTED: 0x08;
  CHECKED: 0x10;
  FOCUSED: 0x20;
  OPENED: 0x40;
};

/**
 * Component event type
 */
export type ComponentEventType = {
  BEFORE_SHOW: 'beforeshow';
  SHOW: 'show';
  HIDE: 'hide';
  DISABLE: 'disable';
  ENABLE: 'enable';
  HIGHLIGHT: 'highlight';
  UNHIGHLIGHT: 'unhighlight';
  ACTIVATE: 'activate';
  DEACTIVATE: 'deactivate';
  SELECT: 'select';
  UNSELECT: 'unselect';
  CHECK: 'check';
  UNCHECK: 'uncheck';
  FOCUS: 'focus';
  BLUR: 'blur';
  OPEN: 'open';
  CLOSE: 'close';
  ENTER: 'enter';
  LEAVE: 'leave';
  ACTION: 'action';
  CHANGE: 'change';
};

/**
 * Event handler type with proper 'this' binding
 */
export type EventHandler<T extends Event = Event> = (this: Component, event: T) => void;

/**
 * Component event map for type-safe event handling
 */
export interface ComponentEventMap {
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
}

/**
 * Component constructor type
 */
export type ComponentConstructor<T extends Component = Component> = new (domHelper?: DomHelper) => T;

/**
 * Component interface
 */
export interface ComponentInterface {
  getId(): string;
  setId(id: string): void;
  getElement(): HTMLElement | null;
  isInDocument(): boolean;
  getParent(): Component | null;
  render(opt_parentElement?: HTMLElement): void;
  dispose(): void;
  enterDocument(): void;
  exitDocument(): void;
  addChild(child: Component): void;
  removeChild(child: Component): void;
  addEventListener<K extends keyof ComponentEventMap>(
    type: K,
    listener: EventHandler<ComponentEventMap[K]>
  ): void;
  removeEventListener<K extends keyof ComponentEventMap>(
    type: K,
    listener: EventHandler<ComponentEventMap[K]>
  ): void;
  dispatchEvent(event: Event): boolean;
}

/**
 * Server-side rendering options
 */
export interface SSROptions {
  hydration?: 'client-only' | 'server-first' | 'progressive';
  ssr?: boolean;
  state?: Record<string, unknown>;
}
