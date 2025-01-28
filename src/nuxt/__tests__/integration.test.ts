import { renderToString } from '../index';
import { Component } from '@closure-next/core';

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

describe('Nuxt Integration', () => {
  test('should render component to string', () => {
    const component = new TestComponent();
    component.setTitle('Test Title');
    
    const html = renderToString(component);
    expect(html).toContain('data-testid="test-component"');
    expect(html).toContain('data-title="Test Title"');
  });

  test('should handle props during SSR', () => {
    const component = new TestComponent();
    component.setTitle('SSR Title');
    
    const html = renderToString(component, {
      props: {
        title: 'SSR Title'
      }
    });
    
    expect(html).toContain('data-title="SSR Title"');
  });

  test('should handle hydration attributes', () => {
    const component = new TestComponent();
    component.setTitle('Hydration Test');
    
    const html = renderToString(component, {
      hydrate: true
    });
    
    expect(html).toContain('data-hydrate');
  });
});
