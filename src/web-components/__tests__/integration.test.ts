import { jest, expect, beforeEach, afterEach } from '@jest/globals';
import { Component, DOMHelper, type EventInterface } from '@closure-next/core';
import { defineClosureElement, createClosureTemplate } from '../index.js';

// Import DomHelper from core package
const domHelper = new DOMHelper(document);
import '@testing-library/jest-dom';

// Increase test timeout
jest.setTimeout(30000);

// Test component
class TestComponent extends Component {
  private title: string = '';
  
  constructor(props?: Record<string, unknown>) {
    super(domHelper);
    if (props?.title && typeof props.title === 'string') {
      this.title = props.title;
    }
  }
  
  setTitle(title: string): void {
    this.title = title;
    const element = this.getElement();
    if (element) {
      element.setAttribute('data-title', title);
      element.textContent = `Test Component Content - ${title}`;
    }
  }
  
  getTitle(): string {
    return this.title;
  }

  protected override async createDom(): Promise<void> {
    if (!this.element) {
      super.createDom();
      const element = this.getElement();
      if (element) {
        element.setAttribute('data-testid', 'test-component');
        element.setAttribute('data-title', this.title);
        element.textContent = `Test Component Content - ${this.title}`;
      }
    }
  }

  public override getElement(): HTMLElement | null {
    return super.getElement();
  }

  public override getParent(): Component | null {
    const parent = super.getParent();
    return parent as Component | null;
  }

  public override getId(): string {
    return super.getId();
  }

  public override setId(id: string): void {
    super.setId(id);
  }

  public override async render(container: HTMLElement): Promise<void> {
    await super.render(container);
  }

  public override dispose(): void {
    super.dispose();
  }

  protected async onEnterDocument(): Promise<void> {
    // Implementation will be provided by derived classes
  }

  protected async onExitDocument(): Promise<void> {
    // Implementation will be provided by derived classes
  }

  public override addChild(child: Component): void {
    super.addChild(child);
  }

  public override removeChild(child: Component): void {
    super.removeChild(child);
  }

  public override addEventListener(type: string, listener: (event: EventInterface) => void): void {
    super.addEventListener(type, listener);
  }

  public override removeEventListener(type: string, listener: (event: EventInterface) => void): void {
    super.removeEventListener(type, listener);
  }

  public override dispatchEvent(type: string, data?: any): void {
    super.dispatchEvent(type, data);
  }
}

describe('Web Components Integration', () => {
  let container: HTMLElement | null;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container?.remove();
    container = null;
    jest.clearAllMocks();
  });

  async function waitForElement(tagName: string): Promise<void> {
    await customElements.whenDefined(tagName);
    // Wait for multiple frames to ensure DOM updates are complete
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => requestAnimationFrame(resolve));
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  async function waitForComponentInit(element: HTMLElement, options = { timeout: 5000, shadow: false }): Promise<void> {
    // Ensure element is in the DOM
    if (!element.isConnected) {
      container?.appendChild(element);
    }

    // Wait for custom element to be defined
    await customElements.whenDefined(element.tagName.toLowerCase());

    // Wait for component to be ready
    const start = Date.now();
    while (Date.now() - start < options.timeout) {
      const root = options.shadow ? element.shadowRoot : element;
      const component = root?.querySelector('[data-testid="test-component"]');
      
      if (component) {
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    throw new Error(`Component initialization timed out after ${options.timeout}ms. Element state: ${JSON.stringify({
      tagName: element.tagName,
      isConnected: element.isConnected,
      hasChildren: element.children.length,
      hasShadowRoot: !!element.shadowRoot,
      innerHTML: element.innerHTML
    }, null, 2)}`);
  }

  test('should register custom element', async () => {
    const tagName = 'test-closure-element';
    defineClosureElement(tagName, TestComponent);
    
    const element = document.createElement(tagName);
    container?.appendChild(element);
    
    await waitForComponentInit(element);
    
    expect(element).toBeTruthy();
    expect(element.shadowRoot).toBeFalsy(); // Default to light DOM
    
    const component = element.querySelector('[data-testid="test-component"]');
    expect(component).toBeTruthy();
    expect(component instanceof HTMLElement).toBe(true);
  });

  test('should handle shadow DOM', async () => {
    const tagName = 'test-shadow-element';
    defineClosureElement(tagName, TestComponent, { shadow: true });
    
    const element = document.createElement(tagName);
    container?.appendChild(element);
    
    await waitForComponentInit(element, { timeout: 5000, shadow: true });
    
    expect(element.shadowRoot).toBeTruthy();
    const component = element.shadowRoot!.querySelector('[data-testid="test-component"]');
    expect(component).toBeTruthy();
    expect(component).toBeInstanceOf(HTMLElement);
  });

  test('should observe attributes', async () => {
    const tagName = 'test-observed-element';
    defineClosureElement(tagName, TestComponent, {
      observedAttributes: ['title']
    });
    
    const element = document.createElement(tagName);
    container?.appendChild(element);
    
    await waitForComponentInit(element);
    
    // Set attribute and wait for changes
    element.setAttribute('title', 'Test Title');
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const component = element.querySelector('[data-testid="test-component"]');
    expect(component).toBeTruthy();
    expect(component?.getAttribute('data-title')).toBe('Test Title');
  });

  test('should clean up on disconnect', async () => {
    const tagName = 'test-cleanup-element';
    defineClosureElement(tagName, TestComponent);
    
    const element = document.createElement(tagName);
    container?.appendChild(element);
    
    await waitForComponentInit(element);
    
    const component = element.querySelector('[data-testid="test-component"]');
    expect(component).toBeTruthy();
    
    // Get Closure component instance
    const closureInstance = (component as any)?._closureComponent;
    expect(closureInstance).toBeTruthy();
    
    const disposeSpy = jest.spyOn(closureInstance, 'dispose');
    
    // Remove from DOM and wait for cleanup
    element.remove();
    await new Promise(resolve => setTimeout(resolve, 50));
    
    expect(disposeSpy).toHaveBeenCalled();
  });

  test('should create template from component', async () => {
    const template = await createClosureTemplate(TestComponent, { title: 'Template Title' });
    
    expect(template instanceof HTMLTemplateElement).toBe(true);
    expect(template.content).toBeTruthy();
    
    const content = template.content.querySelector('[data-testid="test-component"]');
    expect(content).toBeTruthy();
    expect(content?.getAttribute('data-title')).toBe('Template Title');
    
    // Verify template can be cloned
    const clone = template.content.cloneNode(true) as DocumentFragment;
    const clonedContent = clone.querySelector('[data-testid="test-component"]');
    expect(clonedContent).toBeTruthy();
    expect(clonedContent?.getAttribute('data-title')).toBe('Template Title');
  });
});
