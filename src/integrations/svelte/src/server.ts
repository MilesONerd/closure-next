/**
 * @fileoverview Server-side rendering support for Svelte integration.
 * @license Apache-2.0
 */

import { Component, renderToString, hydrateComponent, type SSROptions } from '@closure-next/core';
import type { ComponentType } from 'svelte';

/**
 * Renders a Closure Next component to string for server-side rendering.
 */
export async function renderClosureComponent<T extends Component>(
  ComponentClass: new () => T,
  props: Record<string, unknown> = {},
  options: SSROptions = {}
): Promise<string> {
  const instance = new ComponentClass();
  Object.assign(instance, props);
  return renderToString(instance, props, options);
}

/**
 * Hydrates a Closure Next component on the client side.
 */
export async function hydrateClosureComponent<T extends Component>(
  ComponentClass: new () => T,
  container: HTMLElement,
  props: Record<string, unknown> = {},
  options: SSROptions = {}
): Promise<void> {
  const instance = new ComponentClass();
  Object.assign(instance, props);
  await hydrateComponent(instance, container, props, options);
}

/**
 * Creates a Svelte component that wraps a Closure Next component with SSR support.
 */
export function createSSRComponent<T extends Component>(
  ComponentClass: new () => T,
  options: SSROptions = {}
): ComponentType {
  return class SSRWrapper {
    private instance: T | null = null;
    private container: HTMLElement | null = null;

    constructor(options: { target: HTMLElement; props?: Record<string, unknown> }) {
      this.container = options.target;
      this.instance = new ComponentClass();

      if (options.props) {
        Object.assign(this.instance, options.props);
      }

      // Store reference to Closure component
      Object.defineProperty(this.container, '_closureComponent', {
        value: this.instance,
        configurable: true,
        enumerable: false
      });

      // Handle hydration based on options
      if (options.hydration === 'progressive') {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => this.hydrate());
        } else {
          setTimeout(() => this.hydrate(), 0);
        }
      } else if (options.hydration !== 'client-only') {
        this.hydrate();
      } else {
        this.instance.render(this.container);
      }
    }

    private async hydrate(): Promise<void> {
      if (this.instance && this.container) {
        await hydrateClosureComponent(
          ComponentClass,
          this.container,
          {},
          options
        );
      }
    }

    $destroy() {
      if (this.instance) {
        this.instance.dispose();
        this.instance = null;
      }

      if (this.container) {
        delete (this.container as any)._closureComponent;
        this.container = null;
      }
    }
  };
}
