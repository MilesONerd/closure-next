/**
 * @fileoverview Svelte integration for Closure Next.
 * @license Apache-2.0
 */

import { Component, type ComponentConstructor } from '@closure-next/core';
import type { ComponentType } from 'svelte';
import { createSSRComponent } from './server';

export type { SSROptions } from '@closure-next/core';
export { renderClosureComponent, hydrateClosureComponent } from './server';

interface ClosureComponentOptions<T extends Component> {
  target: HTMLElement;
  props?: Record<string, unknown>;
  component: new () => T;
  ssrOptions?: {
    hydration?: 'client-only' | 'server-first' | 'progressive';
    ssr?: boolean;
  };
}

/**
 * Creates a Svelte-compatible wrapper for a Closure Next component
 */
export function closureComponent<T extends Component>(
  options: ClosureComponentOptions<T>
): ComponentType {
  const { component: ComponentClass, ssrOptions = { hydration: 'progressive', ssr: true } } = options;
  return createSSRComponent(ComponentClass, ssrOptions);
}
