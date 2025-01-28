/**
 * @fileoverview Web Components integration for Closure Next.
 * @license Apache-2.0
 */

import type { Component } from '@closure-next/core';

interface ClosureElementOptions {
  observedAttributes?: string[];
  shadow?: boolean;
}

/**
 * Creates a Web Component class from a Closure Next component
 */
export function defineClosureElement<T extends Component>(
  tagName: string,
  ComponentClass: new () => T,
  options: ClosureElementOptions = {}
): void {
  const { observedAttributes = [], shadow = false } = options;

  class ClosureElement extends HTMLElement {
    private instance: T | null = null;
    private container: HTMLElement | null = null;
    private props: Record<string, unknown>;
    private initialized = false;
    private shadowContainer: HTMLElement | null = null;

    static get observedAttributes(): string[] {
      return observedAttributes;
    }

    constructor() {
      super();
      
      // Initialize props with default values
      this.props = {};
      observedAttributes.forEach(attr => {
        this.props[attr] = null;
      });

      // Create shadow root if needed
      if (shadow) {
        const shadowRoot = this.attachShadow({ mode: 'open' });
        // Create shadow container
        this.shadowContainer = document.createElement('div');
        this.shadowContainer.setAttribute('data-testid', 'shadow-container');
        shadowRoot.appendChild(this.shadowContainer);
      }

      // Create container for component
      this.container = document.createElement('div');
      this.container.setAttribute('data-testid', 'test-component');
      
      // Add container to shadow root or light DOM
      if (shadow && this.shadowContainer) {
        this.shadowContainer.appendChild(this.container);
      } else {
        this.appendChild(this.container);
      }

      // Create instance
      this.instance = new ComponentClass();
      
      // Store reference to component on container
      Object.defineProperty(this.container, '_closureComponent', {
        value: this.instance,
        writable: true,
        configurable: true,
        enumerable: true
      });

      // Initialize component
      if (this.instance) {
        this.instance.render(this.container);
      }

      this.initialized = true;
    }

    private updateComponentProp(name: string, value: string | null): void {
      if (!this.instance) return;

      const setter = `set${name.charAt(0).toUpperCase()}${name.slice(1)}`;
      if (typeof (this.instance as any)[setter] === 'function') {
        (this.instance as any)[setter](value);
      } else if (typeof (this.instance as any)[name] === 'function') {
        (this.instance as any)[name](value);
      } else {
        (this.instance as any)[name] = value;
      }

      // Re-render if needed
      if (this.container) {
        this.instance.render(this.container);
      }
    }



    connectedCallback(): void {
      try {
        // Set initial props from attributes and apply them
        for (const attr of observedAttributes) {
          const value = this.getAttribute(attr);
          if (value !== null) {
            this.props[attr] = value;
            this.updateComponentProp(attr, value);
          }
        }

        // Render into container
        if (this.instance && this.container) {
          this.instance.render(this.container);
        }
      } catch (e) {
        console.error('Error in connectedCallback:', e);
        throw e;
      }
    }

    disconnectedCallback(): void {
      try {
        if (this.instance) {
          // Dispose component first
          this.instance.dispose();
          
          // Clean up DOM
          if (this.container) {
            // First clean up container
            const containerParent = this.container.parentNode;
            if (containerParent) {
              containerParent.removeChild(this.container);
            }

            // Then clean up shadow container if it exists
            if (shadow && this.shadowContainer) {
              const root = this.shadowRoot;
              if (root instanceof ShadowRoot) {
                const shadowParent = this.shadowContainer.parentNode;
                if (shadowParent === root) {
                  shadowParent.removeChild(this.shadowContainer);
                }
              }
            }
          }

          // Reset state
          this.instance = null;
          this.container = null;
          this.shadowContainer = null;
          this.initialized = false;
        }
      } catch (e) {
        console.error('Error in disconnectedCallback:', e);
      }
    }

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ): void {
      if (oldValue === newValue) return;
      
      try {
        // Store the new value
        this.props[name] = newValue;
        
        if (this.instance) {
          // Update component prop
          this.updateComponentProp(name, newValue);
          
          // Force a re-render to ensure changes are reflected
          if (this.container) {
            queueMicrotask(() => {
              try {
                if (this.instance && this.container) {
                  this.instance.render(this.container);
                }
              } catch (e) {
                console.error('Error re-rendering after attribute change:', e);
              }
            });
          }
        }
      } catch (e) {
        console.error('Error updating attribute:', e);
      }
    }
  }

  customElements.define(tagName, ClosureElement);
}

/**
 * Creates a template for a Closure component
 */
export function createClosureTemplate(
  ComponentClass: new () => Component,
  props?: Record<string, unknown>
): HTMLTemplateElement {
  const template = document.createElement('template') as HTMLTemplateElement;
  const instance = new ComponentClass();
  
  try {
    // Create container for component
    const container = document.createElement('div');
    container.setAttribute('data-testid', 'test-component');
    
    // Store reference to Closure component
    Object.defineProperty(container, '_closureComponent', {
      value: instance,
      writable: false,
      configurable: true,
      enumerable: false
    });
    
    // Apply props before rendering
    if (props) {
      Object.entries(props).forEach(([key, value]) => {
        const setter = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
        if (typeof (instance as any)[setter] === 'function') {
          (instance as any)[setter](value);
        } else if (typeof (instance as any)[key] === 'function') {
          (instance as any)[key](value);
        } else {
          (instance as any)[key] = value;
        }
      });
    }

    // Render component
    instance.render(container);
    
    // Clone container and add to template
    template.content.appendChild(container.cloneNode(true));
  } catch (e) {
    console.error('Error creating template:', e);
  } finally {
    // Clean up
    instance.dispose();
  }
  
  return template;
}
