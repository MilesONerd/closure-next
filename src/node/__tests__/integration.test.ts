import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { Component } from '@closure-next/core/dist/index.js';
import { renderToString } from '../index.js';

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

describe('Node.js Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Server-Side Rendering', () => {
    test('should render component to string', () => {
      const html = renderToString(TestComponent);
      expect(html).toContain('data-testid="test-component"');
    });

    test('should handle props in SSR', () => {
      const html = renderToString(TestComponent, {
        title: 'Test Title'
      });
      expect(html).toContain('data-title="Test Title"');
    });

    test('should clean up after rendering', () => {
      const disposeSpy = jest.spyOn(TestComponent.prototype, 'dispose');
      
      renderToString(TestComponent, {
        title: 'Cleanup Test'
      });
      
      expect(disposeSpy).toHaveBeenCalled();
      disposeSpy.mockRestore();
    });
  });

  describe('Module System Compatibility', () => {
    test('should handle ESM import', async () => {
      const nodeModule = await import('../index.js');
      expect(typeof nodeModule.renderToString).toBe('function');
      expect(typeof nodeModule.default.renderToString).toBe('function');
      
      const html = nodeModule.renderToString(TestComponent, {
        title: 'ESM Test'
      });
      
      expect(html).toContain('data-testid="test-component"');
      expect(html).toContain('data-title="ESM Test"');

      // Test default export
      const defaultHtml = nodeModule.default.renderToString(TestComponent, {
        title: 'ESM Default Test'
      });
      
      expect(defaultHtml).toContain('data-testid="test-component"');
      expect(defaultHtml).toContain('data-title="ESM Default Test"');
    });
  });

  describe('Event Handling', () => {
    test('should handle events in Node.js environment', () => {
      const component = new TestComponent();
      const handler = jest.fn();
      
      component.addEventListener('click', handler);
      component.render();
      
      const element = component.getElement();
      expect(element).toBeTruthy();
      
      // Simulate click event
      const event = new Event('click');
      element?.dispatchEvent(event);
      
      expect(handler).toHaveBeenCalled();
    });
  });
});
