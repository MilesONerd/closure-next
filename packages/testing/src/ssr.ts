import { Component, DomHelper, type ComponentProps } from '@closure-next/core';

/**
 * SSR test environment
 */
export interface SSRTestEnvironment {
  document: Document;
  window: Window;
  domHelper: DomHelper;
}

/**
 * Creates an SSR test environment
 */
export function createSSREnvironment(): SSRTestEnvironment {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true,
    runScripts: 'dangerously'
  });

  return {
    document: dom.window.document,
    window: dom.window,
    domHelper: new DomHelper(dom.window.document)
  };
}

/**
 * Renders a component in SSR mode
 */
export async function renderToString<T extends Component>(
  ComponentClass: new (domHelper?: DomHelper) => T,
  props?: ComponentProps
): Promise<string> {
  const env = createSSREnvironment();
  const component = new ComponentClass(env.domHelper);

  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      const method = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
      if (typeof component[method as keyof T] === 'function') {
        (component[method as keyof T] as Function)(value);
      }
    });
  }

  component.createDom();
  const element = component.getElement();
  if (!element) {
    throw new Error('Component failed to create element');
  }

  return element.outerHTML;
}

/**
 * Hydrates a component in SSR mode
 */
export async function hydrateComponent<T extends Component>(
  ComponentClass: new (domHelper?: DomHelper) => T,
  html: string,
  props?: ComponentProps
): Promise<T> {
  const env = createSSREnvironment();
  const container = env.document.createElement('div');
  container.innerHTML = html;
  env.document.body.appendChild(container);

  const component = new ComponentClass(env.domHelper);
  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      const method = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
      if (typeof component[method as keyof T] === 'function') {
        (component[method as keyof T] as Function)(value);
      }
    });
  }

  component.enterDocument();
  return component;
}
