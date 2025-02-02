import { jest } from '@jest/globals';
import {
  Component,
  ComponentState,
  ComponentEventType,
  EventTarget,
  DomHelper
} from '@closure-next/core';
import {
  createDenoElement,
  querySelector,
  querySelectorAll,
  isDeno
} from '../mod';

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

  public override createDom(): void {
    super.createDom();
    if (this.element) {
      this.element.setAttribute('data-testid', 'test-component');
      this.element.setAttribute('data-title', this.title);
    }
  }
}

describe('Deno Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('ESM Module Support', () => {
    test('should import core components', () => {
      expect(Component).toBeDefined();
      expect(ComponentState).toBeDefined();
      expect(ComponentEventType).toBeDefined();
      expect(EventTarget).toBeDefined();
      expect(DomHelper).toBeDefined();
    });

    test('should handle dynamic imports', async () => {
      const module = await import('../mod');
      expect(module.createDenoElement).toBeDefined();
      expect(module.querySelector).toBeDefined();
      expect(module.querySelectorAll).toBeDefined();
      expect(module.isDeno).toBeDefined();
    });
  });

  describe('Deno-specific Utilities', () => {
    test('should create elements', () => {
      const element = createDenoElement('div');
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.tagName).toBe('DIV');
    });

    test('should query elements', () => {
      // Set up test DOM
      document.body.innerHTML = `
        <div class="test">
          <span id="test1">Test 1</span>
          <span id="test2">Test 2</span>
        </div>
      `;

      const single = querySelector('.test');
      expect(single).toBeTruthy();
      expect(single).toBeInstanceOf(Element);

      const multiple = querySelectorAll('span');
      expect(multiple).toHaveLength(2);
      expect(multiple[0]).toBeInstanceOf(Element);
      expect(multiple[1]).toBeInstanceOf(Element);
    });

    test('should detect Deno environment', () => {
      // In test environment, isDeno should be false
      expect(isDeno).toBe(false);

      // Mock Deno global
      (global as any).Deno = {};
      expect(isDeno).toBe(true);
      delete (global as any).Deno;
    });
  });

  describe('Component Integration', () => {
    test('should work with Closure components', () => {
      const component = new TestComponent();
      const container = createDenoElement('div');
      document.body.appendChild(container);

      component.render(container);
      expect(component.getElement()).toBeTruthy();
      expect(component.isInDocument()).toBe(true);

      const element = querySelector('[data-testid="test-component"]');
      expect(element).toBeTruthy();
    });

    test('should handle component events', () => {
      const component = new TestComponent();
      const container = createDenoElement('div');
      document.body.appendChild(container);

      const handler = jest.fn();
      component.addEventListener('click', handler);
      component.render(container);

      const element = component.getElement();
      expect(element).toBeTruthy();

      // Simulate click event
      const event = new Event('click');
      element?.dispatchEvent(event);

      expect(handler).toHaveBeenCalled();
    });

    test('should update component properties', () => {
      const component = new TestComponent();
      const container = createDenoElement('div');
      document.body.appendChild(container);

      component.render(container);
      component.setTitle('Test Title');

      const element = querySelector('[data-testid="test-component"]');
      expect(element).toBeTruthy();
      expect(element).toHaveAttribute('data-title', 'Test Title');
    });
  });
});
