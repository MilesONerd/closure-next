import { DOMHelper } from '@closure-next/core';
import { ServerComponent } from '../server';

class TestComponent extends ServerComponent {
  constructor(domHelper: DOMHelper) {
    super(domHelper);
  }

  protected async createDom(): Promise<void> {
    if (!this.element) {
      this.element = this.domHelper.createElement('div');
      if (this.id) {
        this.element.id = this.id;
      }
    }
    this.element.textContent = 'Test Content';
  }
}

describe('Angular Integration', () => {
  let domHelper: DOMHelper;

  beforeEach(() => {
    domHelper = new DOMHelper(document);
  });

  test('creates component', () => {
    const component = new TestComponent(domHelper);
    expect(component).toBeDefined();
  });
});
