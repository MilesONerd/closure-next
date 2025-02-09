import { Component, DOMHelper } from '@closure-next/core';
import type { SSROptions, HydrationOptions } from './types';

/**
 * Renders a component to string for server-side rendering
 */
export async function renderToString(
  component: typeof Component,
  containerId: string,
  options: Omit<SSROptions, 'component' | 'containerId'> = {}
): Promise<string> {
  const instance = new component(new DOMHelper(document));
  
  if (options.props) {
    Object.assign(instance, options.props);
  }

  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Container with id "${containerId}" not found`);
  }

  await instance.render(container);
  return container.innerHTML;
}

/**
 * Hydrates a server-rendered component on the client
 */
export async function hydrateComponent(
  component: typeof Component,
  containerId: string,
  options: Omit<HydrationOptions, 'component' | 'containerId'> = {}
): Promise<void> {
  const instance = new component(new DOMHelper(document));
  
  if (options.props) {
    Object.assign(instance, options.props);
  }

  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Container with id "${containerId}" not found`);
  }

  await instance.render(container);
}
