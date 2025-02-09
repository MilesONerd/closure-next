import { Component, ComponentState, ComponentInterface } from '@closure-next/core/dist/index.js';
import type { Writable } from 'svelte/store';

/**
 * Svelte-specific component options
 */
export interface ClosureComponentOptions<T extends Component = Component> {
  props?: ComponentState;
  ssrOptions?: {
    hydration?: 'client-only' | 'server-first' | 'progressive';
    ssr?: boolean;
  };
  onMount?: (component: T) => void;
  onDestroy?: (component: T) => void;
  onError?: (error: Error) => void;
}

/**
 * Svelte store for component state
 */
export interface ClosureStore<T extends Component = Component> {
  component: Writable<T | null>;
  props: Writable<ComponentState>;
  element: Writable<HTMLElement | null>;
  setProps(props: Partial<ComponentState>): Promise<void>;
}

/**
 * Component instance with Svelte-specific features
 */
export type ClosureInstance<T extends Component = Component> = T & ComponentInterface;

/**
 * SSR context for Svelte
 */
export interface ClosureSSRContext {
  hydrate: boolean;
  ssr: boolean;
  state: Record<string, unknown>;
}
