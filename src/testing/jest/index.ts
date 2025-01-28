/**
 * @fileoverview Jest testing utilities for Closure Next.
 * @license Apache-2.0
 */

import type { Component } from '@closure-next/core';
import { expect } from '@jest/globals';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeRendered(): R;
      toHaveState(state: number): R;
      toHaveChildren(count: number): R;
    }
  }
}

/**
 * Custom Jest matchers for Closure Next components
 */
expect.extend({
  toBeRendered(received: Component) {
    const element = received.getElement();
    const pass = Boolean(element && element.isConnected);
    return {
      pass,
      message: () =>
        `expected component ${pass ? 'not ' : ''}to be rendered in the DOM`
    };
  },

  toHaveState(received: Component, state: number) {
    const pass = (received as any).getState() === state;
    return {
      pass,
      message: () =>
        `expected component ${pass ? 'not ' : ''}to have state ${state}`
    };
  },

  toHaveChildren(received: Component, count: number) {
    const children = (received as any).children;
    const pass = children.length === count;
    return {
      pass,
      message: () =>
        `expected component to have ${count} children but found ${children.length}`
    };
  }
});

/**
 * Creates a mock component for testing
 */
export function createMockComponent<T extends Component>(
  ComponentClass: new () => T,
  props?: Record<string, unknown>
): T {
  const component = new ComponentClass();
  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      (component as any)[key] = value;
    });
  }
  return component;
}

/**
 * Creates a test container and mounts a component
 */
export function mountComponent<T extends Component>(
  ComponentClass: new () => T,
  props?: Record<string, unknown>
): { component: T; container: HTMLElement } {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const component = createMockComponent(ComponentClass, props);
  component.render(container);

  return { component, container };
}

/**
 * Simulates events on components
 */
export function simulateEvent(
  component: Component,
  eventType: string,
  eventInit?: EventInit
): void {
  const element = component.getElement();
  if (!element) {
    throw new Error('Component not rendered');
  }

  const event = new Event(eventType, eventInit);
  element.dispatchEvent(event);
}

/**
 * Waits for component updates
 */
export async function waitForUpdate(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 0));
}
