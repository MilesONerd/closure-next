/**
 * @fileoverview Server-side rendering support for Closure Next.
 * @license Apache-2.0
 */

import { Component } from './component';

export interface SSROptions {
  hydration?: 'client-only' | 'server-first' | 'progressive';
  ssr?: boolean;
}

/**
 * Renders a component to string for server-side rendering.
 */
export async function renderToString(
  component: Component,
  props?: Record<string, unknown>,
  options: SSROptions = {}
): Promise<string> {
  if (!options.ssr) {
    return '';
  }

  // Apply props if provided
  if (props) {
    Object.assign(component, props);
  }

  // Create temporary container
  const container = document.createElement('div');
  await component.render(container);

  return container.innerHTML;
}

/**
 * Hydrates a component on the client side.
 */
export async function hydrateComponent(
  component: Component,
  container: HTMLElement,
  props?: Record<string, unknown>,
  options: SSROptions = {}
): Promise<void> {
  if (options.hydration === 'client-only') {
    await component.render(container);
    return;
  }

  // Apply props if provided
  if (props) {
    Object.assign(component, props);
  }

  if (options.hydration === 'progressive') {
    // Use requestIdleCallback for progressive hydration
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => component.render(container));
    } else {
      setTimeout(() => component.render(container), 0);
    }
  } else {
    await component.render(container);
  }
}
