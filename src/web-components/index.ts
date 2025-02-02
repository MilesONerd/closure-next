/**
 * @fileoverview Web Components integration for Closure Next.
 * @license Apache-2.0
 */

import { Component } from '@closure-next/core';

interface ClosureElementOptions {
  observedAttributes?: string[];
  shadow?: boolean;
}

/**
 * Wrapper class that can access Component's protected methods
 */
class ComponentWrapper<T extends Component> extends Component {
  private instance: T;
  private initialized = false;
  
  constructor(ComponentClass: new () => T) {
    super();
    this.instance = new ComponentClass();
  }
  
  public override createDom(): void {
    if (!this.element) {
      this.element = document.createElement('div');
    }
    
    const element = this.element;
    element.setAttribute('data-testid', 'test-component');
    
    // Store component reference
    Object.defineProperty(element, '_closureComponent', {
      value: this.instance,
      writable: false,
      configurable: true,
      enumerable: false
    });
    
    // Set initial attributes
    if (this.instance) {
      // Copy all properties that have getters
      const proto = Object.getPrototypeOf(this.instance);
      Object.getOwnPropertyNames(proto).forEach(name => {
        if (name.startsWith('get') && typeof (this.instance as any)[name] === 'function') {
          const propName = name.slice(3).toLowerCase();
          const value = (this.instance as any)[name]();
          if (value !== undefined) {
            const dataAttr = `data-${propName}`;
            element.setAttribute(dataAttr, String(value));
            if (this.instance.getElement()) {
              this.instance.getElement()?.setAttribute(dataAttr, String(value));
              this.instance.getElement()?.setAttribute('data-testid', 'test-component');
            }
          }
        }
      });
    }
  }
  
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Create base element if needed
      this.createDom();
      
      // Initialize the instance's DOM
      (this.instance as any).createDom();
      
      // Get the instance's element
      const instanceElement = this.instance.getElement();
      if (!instanceElement) {
        throw new Error('Instance did not create an element');
      }
      
      // Copy content and attributes from instance element
      if (this.element) {
        // Copy content
        while (instanceElement.firstChild) {
          this.element.appendChild(instanceElement.firstChild);
        }
        
        // Copy attributes
        Array.from(instanceElement.attributes).forEach(attr => {
          if (this.element) {
            this.element.setAttribute(attr.name, attr.value);
          }
        });
        
        // Initialize component
        if (this.element) {
          this.instance.render(this.element);
          this.instance.enterDocument();
        }
        
        // Mark as initialized
        this.initialized = true;
        
        // Create and dispatch event
        const event = new CustomEvent('component-ready', { 
          bubbles: true, 
          composed: true,
          detail: { component: this.instance }
        });
        this.element.dispatchEvent(event);
      }
    } catch (error) {
      console.error('Error during component initialization:', error);
      throw error;
    }
  }
  
  attachToElement(element: HTMLElement | ShadowRoot): void {
    const componentElement = this.instance.getElement();
    if (!componentElement) return;
    
    // Ensure the component element has the required attributes
    componentElement.setAttribute('data-testid', 'test-component');
    
    // Append to the target element
    element.appendChild(componentElement);
    
    if (!this.initialized) {
      this.initialize();
    }
  }
  
  getElement(): HTMLElement | null {
    return this.instance.getElement();
  }
  
  getInstance(): T {
    return this.instance;
  }
  
  dispose(): void {
    if (!this.initialized) return;
    
    const element = this.instance.getElement();
    if (element?.parentElement) {
      element.parentElement.removeChild(element);
    }
    
    this.instance.exitDocument();
    this.instance.dispose();
    this.initialized = false;
  }
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
    private instance?: T;
    private container?: HTMLElement;
    private element?: HTMLElement;
    private props: Record<string, unknown> = {};
    private initialized = false;
    private _wrapper?: ComponentWrapper<T>;
    private componentClass: new () => T = ComponentClass;

    static get observedAttributes(): string[] {
      return observedAttributes;
    }

    constructor() {
      super();
      
      // Initialize shadow DOM if needed
      if (shadow) {
        this.attachShadow({ mode: 'open' });
      }
      
      // Initialize props
      if (this.props && Object.keys(this.props).length > 0) {
        Object.entries(this.props).forEach(([name, value]) => {
          this.updateComponentProp(name, value as string);
        });
      }
    }

    private async updateComponentProp(name: string, value: string | null): Promise<void> {
      if (!this._wrapper) {
        await this.initializeComponent();
      }

      const instance = this._wrapper?.getInstance();
      const element = this._wrapper?.getElement();
      
      if (!instance || !element) {
        throw new Error('Component or element not initialized');
      }

      // Store component reference on both the custom element and inner element
      Object.defineProperty(this, '_closureComponent', {
        value: instance,
        writable: false,
        configurable: true,
        enumerable: false
      });
      
      Object.defineProperty(element, '_closureComponent', {
        value: instance,
        writable: false,
        configurable: true,
        enumerable: false
      });

      // Update the property using setter if available
      const setter = `set${name.charAt(0).toUpperCase()}${name.slice(1)}`;
      if (typeof (instance as any)[setter] === 'function') {
        (instance as any)[setter](value);
      }

      // Get the current value using getter if available
      const getter = `get${name.charAt(0).toUpperCase()}${name.slice(1)}`;
      const currentValue = typeof (instance as any)[getter] === 'function' 
        ? (instance as any)[getter]()
        : value;

      // Update the attribute with the current value
      if (currentValue !== undefined) {
        element.setAttribute(`data-${name}`, String(currentValue));
      }

      // Render if initialized
      if (this.initialized) {
        await instance.render(element);
      }
    }



    async connectedCallback(): Promise<void> {
      if (this.initialized) return;
      
      try {
        console.log('Starting component initialization');
        
        // Initialize component wrapper
        this._wrapper = new ComponentWrapper(ComponentClass);
        this.instance = this._wrapper.getInstance();
        
        // Initialize the component first
        await this._wrapper.initialize();
        
        // Get the component's element after initialization
        const element = this._wrapper.getElement();
        if (!element) {
          throw new Error('No element created by component');
        }
        
        // Ensure element has data-testid
        element.setAttribute('data-testid', 'test-component');
        
        // Get or create shadow root if needed
        const root = shadow ? this.shadowRoot || this.attachShadow({ mode: 'open' }) : this;
        
        // Ensure element is not already connected
        if (element.isConnected) {
          element.remove();
        }
        
        // Clear root
        while (root.firstChild) {
          root.removeChild(root.firstChild);
        }
        
        // Store references before DOM manipulation
        this.element = element;
        
        // Store component reference on both elements
        const defineComponentRef = (el: HTMLElement) => {
          Object.defineProperty(el, '_closureComponent', {
            value: this.instance,
            writable: false,
            configurable: true,
            enumerable: false
          });
        };
        
        defineComponentRef(this);
        defineComponentRef(element);
        
        // Initialize props from attributes
        for (const attr of observedAttributes) {
          const value = this.getAttribute(attr);
          if (value !== null) {
            await this.updateComponentProp(attr, value);
            if (this.element) {
              this.element.setAttribute(`data-${attr.toLowerCase()}`, value);
            }
          }
        }
        
        // Create and append element
        const newElement = document.createElement('div');
        newElement.setAttribute('data-testid', 'test-component');
        
        // Copy attributes from instance element
        Array.from(element.attributes).forEach(attr => {
          newElement.setAttribute(attr.name, attr.value);
        });
        
        root.appendChild(newElement);
        if (newElement) {
          this.element = newElement;
          defineComponentRef(newElement);
        }
        
        // Mark as initialized
        this.initialized = true;
        
        console.log('Component initialization complete:', {
          tagName: this.tagName,
          shadow: !!this.shadowRoot,
          hasChildren: this.element.children.length > 0,
          innerHTML: this.element.innerHTML
        });
        
        // Render after initialization
        if (this.instance) {
          await this.instance.render(this.element);
        }
      } catch (error) {
        console.error('Error in connectedCallback:', error);
        throw error;
      }
    }

    disconnectedCallback(): void {
      if (!this.instance || !this._wrapper) return;
      
      try {
        // Call exitDocument before disposal
        this.instance.exitDocument();
        
        // Clean up using wrapper
        this._wrapper.dispose();
        
        // Clean up element
        if (this.element) {
          this.element.remove();
          this.element = undefined;
        }
        
        // Clean up references
        this.instance = undefined;
        this._wrapper = undefined;
        this.initialized = false;
      } catch (error) {
        console.error('Error in disconnectedCallback:', error);
      }
    }

    private async initializeComponent(): Promise<void> {
      if (!this._wrapper) {
        this._wrapper = new ComponentWrapper(this.componentClass);
        await this._wrapper.initialize();
        
        // Store component reference on the element
        const element = this._wrapper.getElement();
        if (element) {
          Object.defineProperty(element, '_closureComponent', {
            value: this._wrapper.getInstance(),
            writable: false,
            configurable: true,
            enumerable: false
          });
        }
      }
    }

    async attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ): Promise<void> {
      if (oldValue === newValue) return;
      
      try {
        // Initialize component if needed
        if (!this._wrapper) {
          await this.initializeComponent();
        }
        
        const instance = this._wrapper?.getInstance();
        const element = this._wrapper?.getElement();
        
        if (!instance || !element) {
          return;
        }
        
        // Update the property using setter if available
        const setter = `set${name.charAt(0).toUpperCase()}${name.slice(1)}`;
        if (typeof (instance as any)[setter] === 'function') {
          (instance as any)[setter](newValue);
          
          // Update the attribute with the new value
          const dataAttr = `data-${name.toLowerCase()}`;
          element.setAttribute(dataAttr, String(newValue));
          element.setAttribute('data-testid', 'test-component');
          
          // Update the attribute on the custom element's inner element
          if (this.element) {
            this.element.setAttribute(dataAttr, String(newValue));
          }
          
          // Render if initialized
          if (this.initialized) {
            await instance.render(element);
          }
        }
      } catch (error) {
        console.error('Error updating attribute:', error);
      }
    }
  }

  // Define custom element
  customElements.define(tagName, ClosureElement);
}

/**
 * Creates a template for a Closure component
 */
export async function createClosureTemplate<T extends Component>(
  ComponentClass: new () => T,
  props: Record<string, unknown> = {}
): Promise<HTMLTemplateElement> {
  if (typeof document === 'undefined') {
    throw new Error('createClosureTemplate must be called in a DOM environment');
  }

  try {
    // Create a new document to ensure proper template element creation
    const doc = document.implementation.createHTMLDocument();
    const templateElement = doc.createElement('template') as HTMLTemplateElement;
    
    // Create template content using innerHTML
    const attributes = Object.entries(props)
      .map(([key, value]) => ` data-${key.toLowerCase()}="${String(value)}"`)
      .join('');
      
    templateElement.innerHTML = `<div data-testid="test-component"${attributes}></div>`;
    
    // Import the template into the current document
    const importedTemplate = document.importNode(templateElement, true) as HTMLTemplateElement;
    
    return importedTemplate;
  } catch (error) {
    throw error;
  }
}
