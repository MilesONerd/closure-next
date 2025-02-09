import { Component, DomHelper, type ComponentProps } from '@closure-next/core';

/**
 * Creates a test component instance with mocked DOM
 */
export function createTestComponent<T extends Component>(
  ComponentClass: new (domHelper?: DomHelper) => T,
  props?: ComponentProps
): T {
  const domHelper = new DomHelper(document);
  const component = new ComponentClass(domHelper);

  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      const method = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
      if (typeof component[method as keyof T] === 'function') {
        (component[method as keyof T] as Function)(value);
      }
    });
  }

  return component;
}

/**
 * Creates a test container for component rendering
 */
export function createTestContainer(): HTMLElement {
  const container = document.createElement('div');
  container.setAttribute('data-testid', 'test-container');
  document.body.appendChild(container);
  return container;
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
    throw new Error('Component has no element');
  }

  const event = new Event(eventType, {
    bubbles: true,
    cancelable: true,
    ...eventInit
  });

  element.dispatchEvent(event);
}

/**
 * Waits for component to be rendered
 */
export async function waitForComponent(component: Component): Promise<void> {
  return new Promise<void>((resolve) => {
    if (component.isInDocument()) {
      resolve();
      return;
    }

    const observer = new MutationObserver(() => {
      if (component.isInDocument()) {
        observer.disconnect();
        resolve();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}
