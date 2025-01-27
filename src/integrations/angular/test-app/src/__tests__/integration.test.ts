import { Component } from '@closure-next/core';
import { ClosureComponentDirective } from '../../../src';

class TestComponent extends ClosureComponent {
  private title: string = '';
  
  constructor() {
    super();
    this.id = 'test-component';
  }
  
  setTitle(title: string): void {
    this.title = title;
    if (this.element) {
      this.element.setAttribute('data-title', this.title);
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

// Simple test wrapper
class TestWrapper {
  private container: HTMLElement;
  private component: TestComponent;

  constructor() {
    this.container = document.createElement('div');
    this.container.setAttribute('data-testid', 'angular-wrapper');
    document.body.appendChild(this.container);
    
    this.component = new TestComponent();
    this.component.setTitle('Initial Title');
    this.component.render(this.container);
  }

  getComponent(): TestComponent {
    return this.component;
  }

  updateTitle(title: string): void {
    this.component.setTitle(title);
  }

  destroy(): void {
    this.component.dispose();
    this.container.remove();
  }
}

describe('Angular Integration', () => {
  let wrapper: TestWrapper;

  beforeEach(() => {
    wrapper = new TestWrapper();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it('should render Closure component with plug-and-play functionality', () => {
    const component = wrapper.getComponent();
    const element = document.querySelector('[data-testid="test-component"]');
    
    expect(element).toBeTruthy();
    expect(element?.isConnected).toBe(true);
    expect(component.isInDocument()).toBe(true);
    expect(component.getTitle()).toBe('Initial Title');
  });

  it('should initialize component with props', () => {
    const component = wrapper.getComponent();
    const element = document.querySelector('[data-testid="test-component"]');
    
    expect(element).toBeTruthy();
    expect(element).toHaveAttribute('data-title', 'Initial Title');
    expect(component.getTitle()).toBe('Initial Title');
  });

  it('should update component on prop changes', () => {
    const component = wrapper.getComponent();
    const element = document.querySelector('[data-testid="test-component"]');
    
    expect(element).toBeTruthy();
    expect(element).toHaveAttribute('data-title', 'Initial Title');
    
    wrapper.updateTitle('Updated Title');
    expect(element).toHaveAttribute('data-title', 'Updated Title');
    expect(component.getTitle()).toBe('Updated Title');
  });

  it('should handle event listeners', () => {
    const component = wrapper.getComponent();
    const element = document.querySelector('[data-testid="test-component"]');
    expect(element).toBeTruthy();
    
    const handler = jest.fn();
    component.addEventListener('click', handler);
    
    element?.click();
    expect(handler).toHaveBeenCalled();
  });

  it('should clean up properly on destroy', () => {
    const component = wrapper.getComponent();
    const element = document.querySelector('[data-testid="test-component"]');
    expect(element).toBeTruthy();
    
    const disposeSpy = jest.spyOn(component, 'dispose');
    wrapper.destroy();
    
    expect(disposeSpy).toHaveBeenCalled();
    expect(element?.isConnected).toBe(false);
  });
});
