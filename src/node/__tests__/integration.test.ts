import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { Component, DomHelper } from '@closure-next/core';
import { renderToString } from '../index.js';

// Test component
class TestComponent extends Component {
  private title: string = '';
  
  constructor(props?: Record<string, unknown>) {
    const domHelper = new DomHelper(document);
    super(domHelper);
    if (props?.title && typeof props.title === 'string') {
      this.title = props.title;
    }
    this.createDom();
    this.enterDocument();
  }
  
  setTitle(title: string): void {
    this.title = title;
    if (!this.element) {
      this.createDom();
    }
    const element = this.getElement();
    if (element) {
      element.setAttribute('data-title', title);
      element.textContent = `Test Component Content - ${title}`;
    }
  }
  
  getTitle(): string {
    return this.title;
  }

  public override createDom(): void {
    if (!this.element) {
      super.createDom();
      const element = this.getElement();
      if (element) {
        element.setAttribute('data-testid', 'test-component');
        element.setAttribute('data-title', this.title);
      }
    }
  }

  public override getElement(): HTMLElement | null {
    return super.getElement();
  }

  public override isInDocument(): boolean {
    return super.isInDocument();
  }

  public override getParent(): Component | null {
    return super.getParent();
  }

  public override dispose(): void {
    if (this.isInDocument()) {
      this.exitDocument();
    }
    if (this.element && this.element.parentElement) {
      this.element.parentElement.removeChild(this.element);
    }
    super.dispose();
  }

  public override enterDocument(): void {
    if (!this.isInDocument()) {
      super.enterDocument();
    }
  }

  public override exitDocument(): void {
    if (this.isInDocument()) {
      super.exitDocument();
    }
  }
}

describe('Node.js Integration', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('Server-Side Rendering', () => {
    test('should render component to string', () => {
      const html = renderToString(TestComponent as unknown as new (props?: Record<string, unknown>) => Component);
      expect(html).toContain('data-testid="test-component"');
    });

    test('should handle props in SSR', () => {
      const html = renderToString(TestComponent as unknown as new (props?: Record<string, unknown>) => Component, {
        title: 'Test Title'
      });
      expect(html).toContain('data-title="Test Title"');
    });

    test('should clean up after rendering', () => {
      const disposeSpy = jest.spyOn(TestComponent.prototype, 'dispose');
      
      renderToString(TestComponent as unknown as new (props?: Record<string, unknown>) => Component, {
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
      
      const element = component.getElement();
      expect(element).toBeTruthy();
      
      if (element) {
        const event = new Event('click');
        element.dispatchEvent(event);
        expect(handler).toHaveBeenCalled();
      }
      
      component.dispose();
    });
  });
});
