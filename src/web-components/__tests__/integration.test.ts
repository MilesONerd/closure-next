import { jest, expect } from '@jest/globals';
import { Component } from '@closure-next/core';
import { defineClosureElement, createClosureTemplate } from '../index';
import '@testing-library/jest-dom';

// Increase test timeout
jest.setTimeout(30000);

// Test component
class TestComponent extends Component {
  private title: string = '';
  
  setTitle(title: string): void {
    this.title = title;
    if (this.element) {
      this.element.setAttribute('data-title', title);
    }
  }
  
  getTitle(): string {
    return this.title;
  }

  protected override createDom(): void {
    super.createDom();
    if (this.element) {
      this.element.setAttribute('data-testid', 'test-component');
      this.element.setAttribute('data-title', this.title);
    }
  }
}

describe('Web Components Integration', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    jest.useFakeTimers();
  });

  afterEach(() => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
    container = null!;
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  async function waitForElement(tagName: string): Promise<void> {
    await customElements.whenDefined(tagName);
    jest.runAllTimers();
    await Promise.resolve(); // Let microtasks run
  }

  test('should register custom element', async () => {
    const tagName = 'test-closure-element';
    defineClosureElement(tagName, TestComponent);
    
    const element = document.createElement(tagName);
    container.appendChild(element);
    
    await waitForElement(tagName);
    
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
    container.appendChild(element);
    
    await waitForElement(tagName);
    
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
    container.appendChild(element);
    
    await waitForElement(tagName);
    
    // Wait for component to be initialized
    await new Promise(resolve => setTimeout(resolve, 0));
    jest.runAllTimers();
    
    // Set attribute
    element.setAttribute('title', 'Test Title');
    
    // Wait for attribute change to be processed
    await new Promise(resolve => setTimeout(resolve, 0));
    jest.runAllTimers();
    
    const component = element.querySelector('[data-testid="test-component"]');
    expect(component).toBeTruthy();
    expect(component?.getAttribute('data-title')).toBe('Test Title');
  });

  test('should clean up on disconnect', async () => {
    const tagName = 'test-cleanup-element';
    defineClosureElement(tagName, TestComponent);
    
    const element = document.createElement(tagName);
    container.appendChild(element);
    
    await waitForElement(tagName);
    
    const component = element.querySelector('[data-testid="test-component"]');
    expect(component).toBeTruthy();
    
    // Get Closure component instance
    const closureInstance = (component as any)?._closureComponent;
    expect(closureInstance).toBeTruthy();
    
    const disposeSpy = jest.spyOn(closureInstance, 'dispose');
    
    // Remove from DOM
    element.remove();
    jest.runAllTimers();
    await Promise.resolve(); // Let microtasks run
    
    expect(disposeSpy).toHaveBeenCalled();
  });

  test('should create template from component', async () => {
    const template = createClosureTemplate(TestComponent, {
      title: 'Template Title'
    });
    
    expect(template instanceof HTMLTemplateElement).toBe(true);
    const content = (template as HTMLTemplateElement).content.querySelector('[data-testid="test-component"]');
    expect(content).toBeTruthy();
    expect(content?.getAttribute('data-title')).toBe('Template Title');
  });
});
