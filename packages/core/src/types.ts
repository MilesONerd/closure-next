import { Component } from './component';

/**
 * Generic component props type
 */
export interface ComponentProps<T = unknown> {
  [key: string]: T;
}

/**
 * Component state interface
 */
export interface ComponentStateInterface<T = unknown> {
  [key: string]: T;
}

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
