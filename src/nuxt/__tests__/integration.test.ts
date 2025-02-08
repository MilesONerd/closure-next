import { describe, test, expect } from '@jest/globals';
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

  public override createDom(): void {
    super.createDom();
    if (this.element) {
      this.element.setAttribute('data-testid', 'test-component');
      this.element.setAttribute('data-title', this.title);
    }
  }
}

describe('Nuxt Integration', () => {
  test('should create component', () => {
    const component = new TestComponent();
    component.setTitle('Test Title');
    component.render();
    
    const element = component.getElement();
    expect(element).toBeTruthy();
    expect(element?.getAttribute('data-testid')).toBe('test-component');
    expect(element?.getAttribute('data-title')).toBe('Test Title');
  });
});
