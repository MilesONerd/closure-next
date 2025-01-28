// Jest setup for Web Components integration tests
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';

// Extend global object type
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      expect: typeof expect;
    }
  }

  // Extend Jest matchers
  namespace jest {
    interface Matchers<R> {
      toHaveAttribute(attr: string, value: string): R;
    }
  }
}

// Configure Jest globals
(global as any).expect = expect;

// Basic DOM setup
// Mock Range API
class MockRange implements Range {
  readonly START_TO_START = 0;
  readonly START_TO_END = 1;
  readonly END_TO_END = 2;
  readonly END_TO_START = 3;

  commonAncestorContainer: Node = document.createElement('div');
  startContainer: Node = document.createElement('div');
  endContainer: Node = document.createElement('div');
  startOffset: number = 0;
  endOffset: number = 0;
  collapsed: boolean = true;

  setStart(node: Node, offset: number): void {
    this.startContainer = node;
    this.startOffset = offset;
  }

  setEnd(node: Node, offset: number): void {
    this.endContainer = node;
    this.endOffset = offset;
  }

  setStartBefore(node: Node): void {
    if (node.parentNode) {
      const index = Array.from(node.parentNode.childNodes).indexOf(node as ChildNode);
      if (index !== -1) {
        this.setStart(node.parentNode, index);
      }
    }
  }

  setStartAfter(node: Node): void {
    if (node.parentNode) {
      const index = Array.from(node.parentNode.childNodes).indexOf(node as ChildNode);
      if (index !== -1) {
        this.setStart(node.parentNode, index + 1);
      }
    }
  }

  setEndBefore(node: Node): void {
    if (node.parentNode) {
      const index = Array.from(node.parentNode.childNodes).indexOf(node as ChildNode);
      if (index !== -1) {
        this.setEnd(node.parentNode, index);
      }
    }
  }

  setEndAfter(node: Node): void {
    if (node.parentNode) {
      const index = Array.from(node.parentNode.childNodes).indexOf(node as ChildNode);
      if (index !== -1) {
        this.setEnd(node.parentNode, index + 1);
      }
    }
  }

  collapse(toStart?: boolean): void {
    if (toStart) {
      this.endContainer = this.startContainer;
      this.endOffset = this.startOffset;
    } else {
      this.startContainer = this.endContainer;
      this.startOffset = this.endOffset;
    }
    this.collapsed = true;
  }

  selectNode(node: Node): void {
    this.setStartBefore(node);
    this.setEndAfter(node);
  }

  selectNodeContents(node: Node): void {
    this.startContainer = node;
    this.endContainer = node;
    this.startOffset = 0;
    this.endOffset = node.childNodes.length;
  }

  compareBoundaryPoints(how: number, sourceRange: Range): number {
    return 0;
  }

  deleteContents(): void {
    // No-op in mock
  }

  extractContents(): DocumentFragment {
    return document.createDocumentFragment();
  }

  cloneContents(): DocumentFragment {
    return document.createDocumentFragment();
  }

  insertNode(node: Node): void {
    // No-op in mock
  }

  surroundContents(newParent: Node): void {
    // No-op in mock
  }

  cloneRange(): Range {
    const range = new MockRange();
    range.startContainer = this.startContainer;
    range.endContainer = this.endContainer;
    range.startOffset = this.startOffset;
    range.endOffset = this.endOffset;
    range.collapsed = this.collapsed;
    return range;
  }

  toString(): string {
    return '';
  }

  detach(): void {
    // No-op in mock
  }

  createContextualFragment(fragment: string): DocumentFragment {
    const template = document.createElement('template') as HTMLTemplateElement;
    template.innerHTML = fragment;
    return template.content;
  }

  comparePoint(node: Node, offset: number): number {
    return 0;
  }

  intersectsNode(node: Node): boolean {
    return false;
  }

  isPointInRange(node: Node, offset: number): boolean {
    return false;
  }

  getBoundingClientRect(): DOMRect {
    return DOMRect.fromRect({ x: 0, y: 0, width: 0, height: 0 });
  }

  getClientRects(): DOMRectList {
    return Object.create(DOMRectList.prototype, {
      length: { value: 0 },
      item: { value: () => null }
    });
  }
}

document.createRange = (): Range => new MockRange();

// Type declarations
// Extend HTMLElement with custom element lifecycle methods
declare global {
  interface HTMLElement {
    connectedCallback?(): void;
    disconnectedCallback?(): void;
    attributeChangedCallback?(name: string, oldValue: string | null, newValue: string | null): void;
    adoptedCallback?(): void;
  }
}

interface MockCustomElement extends HTMLElement {
  attachShadow(init: ShadowRootInit): ShadowRoot;
  parentElement: HTMLElement | null;
  remove(): void;
}

interface MockCustomElementConstructor extends CustomElementConstructor {
  new(): MockCustomElement;
  observedAttributes?: string[];
  prototype: MockCustomElement;
}

// Mock template element
class MockTemplateElement extends HTMLElement {
  private _content: DocumentFragment;

  constructor() {
    super();
    this._content = document.createDocumentFragment();
  }

  get content(): DocumentFragment {
    return this._content;
  }

  set innerHTML(html: string) {
    super.innerHTML = html;
    // Parse HTML and populate content
    const div = document.createElement('div');
    div.innerHTML = html;
    this._content = document.createDocumentFragment();
    while (div.firstChild) {
      this._content.appendChild(div.firstChild);
    }
  }
}

// Mock customElements API
const customElementRegistry = new Map<string, CustomElementConstructor>();
const elementRegistry = new Set<Element>();

// Create base HTMLElement class that implements all required properties
class MockHTMLElement extends HTMLElement {
  private _shadowRoot: ShadowRoot | null = null;
  private _initialized = false;
  
  constructor() {
    super();
    elementRegistry.add(this);
  }

  get shadowRoot(): ShadowRoot | null {
    return this._shadowRoot;
  }

  attachShadow(init: ShadowRootInit): ShadowRoot {
    if (this._shadowRoot) {
      throw new Error('Shadow root already attached');
    }
    const shadowRoot = document.createElement('div') as unknown as ShadowRoot;
    Object.defineProperties(shadowRoot, {
      mode: { value: init.mode },
      host: { value: this }
    });
    this._shadowRoot = shadowRoot;
    return shadowRoot;
  }

  remove(): void {
    if (typeof this.disconnectedCallback === 'function') {
      try {
        this.disconnectedCallback();
      } catch (e) {
        console.error('Error in disconnectedCallback:', e);
      }
    }
    elementRegistry.delete(this);
    super.remove();
  }

  // Initialize element when connected
  connectedCallback?(): void {
    if (!this._initialized) {
      this._initialized = true;
      if (typeof (this as any).initializeContainer === 'function') {
        (this as any).initializeContainer();
      }
    }
  }
  
  disconnectedCallback?(): void;
  attributeChangedCallback?(name: string, oldValue: string | null, newValue: string | null): void;
  adoptedCallback?(): void;
}

// Store original createElement
const originalCreateElement = Document.prototype.createElement;

// Create type-safe createElement override
function createElementOverride(
  this: Document,
  tagName: string,
  options?: ElementCreationOptions
): HTMLElement {
  const tag = tagName.toLowerCase();
  
  // Handle template elements
  if (tag === 'template') {
    const template = originalCreateElement.call(this, tagName, options);
    Object.setPrototypeOf(template, MockTemplateElement.prototype);
    return template;
  }
  const CustomElement = customElementRegistry.get(tagName.toLowerCase());
  if (CustomElement) {
    // Create base element
    const element = originalCreateElement.call(this, tagName, options);
    
    // Set up prototype chain
    Object.setPrototypeOf(element, CustomElement.prototype);
    Object.setPrototypeOf(CustomElement.prototype, MockHTMLElement.prototype);
    
    // Add to registry
    elementRegistry.add(element);
    
    // Copy methods from prototype
    const prototype = Object.getPrototypeOf(element);
    Object.getOwnPropertyNames(prototype).forEach(prop => {
      if (prop !== 'constructor' && typeof prototype[prop] === 'function') {
        (element as any)[prop] = prototype[prop].bind(element);
      }
    });
    
    // Set up MutationObserver for lifecycle events
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node === element && typeof element.connectedCallback === 'function') {
              queueMicrotask(() => {
                try {
                  element.connectedCallback!();
                } catch (e) {
                  console.error('Error in connectedCallback:', e);
                }
              });
            }
          });
          
          mutation.removedNodes.forEach((node) => {
            if (node === element && typeof element.disconnectedCallback === 'function') {
              queueMicrotask(() => {
                try {
                  element.disconnectedCallback!();
                } catch (e) {
                  console.error('Error in disconnectedCallback:', e);
                }
              });
            }
          });
        } else if (mutation.type === 'attributes' && typeof element.attributeChangedCallback === 'function') {
          const { attributeName, oldValue } = mutation;
          const newValue = element.getAttribute(attributeName!);
          queueMicrotask(() => {
            try {
              element.attributeChangedCallback!(attributeName!, oldValue, newValue);
            } catch (e) {
              console.error('Error in attributeChangedCallback:', e);
            }
          });
        }
      });
    });
    
    observer.observe(element, { 
      attributes: true,
      childList: true,
      subtree: true,
      attributeOldValue: true
    });
    
    return element;
  }
  return originalCreateElement.call(this, tagName, options);
};

// Override createElement
Document.prototype.createElement = createElementOverride;

// Create mock CustomElementRegistry
interface CustomElementRegistryInterface {
  define(name: string, constructor: CustomElementConstructor): void;
  get(name: string): CustomElementConstructor | undefined;
  whenDefined(name: string): Promise<CustomElementConstructor>;
  upgrade(root: Element | Document): void;
}

class MockCustomElementRegistry implements CustomElementRegistryInterface {
  define(name: string, constructor: CustomElementConstructor): void {
    name = name.toLowerCase();
    if (customElementRegistry.has(name)) {
      throw new Error(`Custom element ${name} already defined`);
    }
    customElementRegistry.set(name, constructor);
    
    // Handle any existing elements
    const elements = document.getElementsByTagName(name);
    Array.from(elements).forEach(element => {
      Object.setPrototypeOf(element, constructor.prototype);
      Object.setPrototypeOf(constructor.prototype, MockHTMLElement.prototype);
      const instance = new constructor();
      
      // Add to registry
      elementRegistry.add(element);
      
      // Copy properties from instance to element
      Object.getOwnPropertyNames(instance).forEach(prop => {
        if (prop !== 'constructor') {
          try {
            Object.defineProperty(element, prop, {
              value: (instance as any)[prop],
              writable: true,
              configurable: true,
              enumerable: true
            });
          } catch (e) {
            console.warn(`Failed to copy property ${prop}:`, e);
          }
        }
      });
      
      // Call connectedCallback asynchronously
      if (typeof (instance as any).connectedCallback === 'function') {
        queueMicrotask(() => {
          try {
            (instance as any).connectedCallback.call(element);
          } catch (e) {
            console.error('Error in connectedCallback:', e);
          }
        });
      }
    });
  }
  
  get(name: string): CustomElementConstructor | undefined {
    return customElementRegistry.get(name.toLowerCase());
  }
  
  whenDefined(name: string): Promise<CustomElementConstructor> {
    name = name.toLowerCase();
    if (customElementRegistry.has(name)) {
      return Promise.resolve(customElementRegistry.get(name)!);
    }
    return new Promise((resolve) => {
      const check = () => {
        if (customElementRegistry.has(name)) {
          resolve(customElementRegistry.get(name)!);
        } else {
          queueMicrotask(check);
        }
      };
      check();
    });
  }
  
  upgrade(root: Element | Document): void {
    // Find all elements that match registered custom elements
    const elements = root.querySelectorAll('*');
    elements.forEach((element: Element) => {
      const constructor = customElementRegistry.get(element.tagName.toLowerCase());
      if (constructor) {
        Object.setPrototypeOf(element, constructor.prototype);
        Object.setPrototypeOf(constructor.prototype, MockHTMLElement.prototype);
        const instance = new constructor();
        
        // Add to registry
        elementRegistry.add(element);
        
        // Copy properties from instance to element
        Object.getOwnPropertyNames(instance).forEach(prop => {
          if (prop !== 'constructor') {
            try {
              Object.defineProperty(element, prop, {
                value: (instance as any)[prop],
                writable: true,
                configurable: true,
                enumerable: true
              });
            } catch (e) {
              console.warn(`Failed to copy property ${prop}:`, e);
            }
          }
        });
        
        // Call connectedCallback if element is in document
        if (element.isConnected && typeof (instance as any).connectedCallback === 'function') {
          queueMicrotask(() => {
            try {
              (instance as any).connectedCallback.call(element);
            } catch (e) {
              console.error('Error in connectedCallback:', e);
            }
          });
        }
      }
    });
  }
}

const mockCustomElements = new MockCustomElementRegistry();

// Install mock CustomElementRegistry
Object.defineProperty(window, 'customElements', {
  value: mockCustomElements,
  configurable: true,
  writable: true
});

// Add custom matchers
expect.extend({
  toHaveAttribute(element: Element | null, attr: string, value: string) {
    if (!element || typeof element.getAttribute !== 'function') {
      return {
        pass: false,
        message: () => `expected element to be a DOM element with getAttribute method`
      };
    }
    const actualValue = element.getAttribute(attr);
    const pass = actualValue === value;
    return {
      pass,
      message: () =>
        pass
          ? `expected element not to have attribute ${attr}=${value}`
          : `expected element to have attribute ${attr}=${value} but got ${actualValue}`
    };
  },
  toBeInstanceOf(received: any, expected: any) {
    const pass = received instanceof expected;
    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be instance of ${expected}`
          : `expected ${received} to be instance of ${expected}`
    };
  },
  toBeTruthy(received: any) {
    const pass = Boolean(received);
    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be truthy`
          : `expected ${received} to be truthy`
    };
  }
});

// Set up fake timers
jest.useFakeTimers();

// Clean up between tests
beforeEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
  jest.useFakeTimers();
  customElementRegistry.clear();
  elementRegistry.clear();
  jest.clearAllTimers();
});

afterEach(() => {
  // Clean up any remaining elements
  elementRegistry.forEach((element) => {
    if (typeof (element as any).disconnectedCallback === 'function') {
      try {
        (element as any).disconnectedCallback();
      } catch (e) {
        console.error('Error in disconnectedCallback:', e);
      }
    }
  });
  
  document.body.innerHTML = '';
  customElementRegistry.clear();
  elementRegistry.clear();
  jest.clearAllMocks();
  jest.useRealTimers();
});
