import { Component, ComponentInterface } from '@closure-next/core';

class TestComponent extends Component implements ComponentInterface {
  private title: string = '';
  
  setTitle(title: string): void {
    this.title = title;
    const element = this.getElement();
    if (element) {
      element.setAttribute('data-title', title);
    }
  }
  
  getTitle(): string {
    return this.title;
  }

  protected override createDom(): void {
    super.createDom();
    const element = this.getElement();
    if (element) {
      element.setAttribute('data-testid', 'test-component');
      element.setAttribute('data-title', this.title);
    }
  }
}

describe('Basic Component Test', () => {
  let component: TestComponent;
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    component = new TestComponent();
  });

  afterEach(() => {
    component.dispose();
    container.remove();
  });

  test('should render component', () => {
    component.render(container);
    expect(component.getElement()).toBeTruthy();
    expect(component.isInDocument()).toBe(true);
  });

  test('should handle title updates', () => {
    component.render(container);
    component.setTitle('Test Title');
    const element = component.getElement();
    expect(element).toBeTruthy();
    expect(element?.getAttribute('data-title')).toBe('Test Title');
  });
});
