import { Component } from '@closure-next/core';
import { createMockComponent, mountComponent, simulateEvent, waitForUpdate } from '../jest';

class TestComponent extends Component {
  private title: string = 'Test Component';

  constructor() {
    super();
  }

  public createDom(): void {
    super.createDom();
    const element = this.getElement();
    if (element) {
      element.setAttribute('data-testid', 'test-component');
      element.setAttribute('data-title', this.title);
    }
  }

  getTitle(): string {
    return this.title;
  }

  setTitle(title: string): void {
    this.title = title;
    const element = this.getElement();
    if (element) {
      element.setAttribute('data-title', title);
    }
  }
}

describe('Jest Utilities', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('createMockComponent', () => {
    test('creates component instance', () => {
      const component = createMockComponent(TestComponent);
      expect(component).toBeInstanceOf(TestComponent);
    });
  });

  describe('mountComponent', () => {
    test('mounts component to DOM', () => {
      const { component, container } = mountComponent(TestComponent);
      expect(container.isConnected).toBe(true);
      expect(component.getElement()).toBeTruthy();
      expect(component.getElement()?.isConnected).toBe(true);
    });
  });

  describe('simulateEvent', () => {
    test('dispatches event on component', () => {
      const { component } = mountComponent(TestComponent);
      const handler = jest.fn();
      component.getElement()?.addEventListener('click', handler);
      simulateEvent(component, 'click');
      expect(handler).toHaveBeenCalled();
    });
  });

  describe('waitForUpdate', () => {
    test('waits for next tick', async () => {
      const { component } = mountComponent(TestComponent);
      let updated = false;
      setTimeout(() => { updated = true; }, 0);
      await waitForUpdate();
      expect(updated).toBe(true);
    });
  });
});
