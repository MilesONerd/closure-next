import { Component, DomHelper } from '@closure-next/core';
import { createTestComponent, createTestContainer, simulateEvent, waitForComponent } from '../../src/component';

class TestComponent extends Component {
  constructor(domHelper?: DomHelper) {
    super(domHelper!);
  }

  private title = '';

  setTitle(title: string): void {
    this.title = title;
  }

  createDom(): void {
    const element = this.domHelper.createElement('div');
    element.textContent = this.title;
    element.setAttribute('data-testid', 'test-component');
    this.element = element;
  }
}

describe('Component Testing Utilities', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = createTestContainer();
  });

  afterEach(() => {
    container.remove();
  });

  test('createTestComponent creates component with props', () => {
    const component = createTestComponent(TestComponent, { title: 'Test Title' });
    component.createDom();
    expect(component.getElement()?.textContent).toBe('Test Title');
  });

  test('simulateEvent triggers event handlers', () => {
    const component = createTestComponent(TestComponent);
    const handler = jest.fn();
    component.addEventListener('click', handler);
    component.createDom();
    simulateEvent(component, 'click');
    expect(handler).toHaveBeenCalled();
  });

  test('waitForComponent resolves when component is in document', async () => {
    const component = createTestComponent(TestComponent);
    component.createDom();
    
    const promise = waitForComponent(component);
    component.render(container);
    
    await expect(promise).resolves.toBeUndefined();
  });
});
