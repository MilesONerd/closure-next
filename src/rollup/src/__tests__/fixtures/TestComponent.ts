import { Component, DOMHelper } from '@closure-next/core';

class TestComponent extends Component {
  title = 'Test Component';

  constructor(domHelper: DOMHelper) {
    super(domHelper);
  }

  async render(container: HTMLElement): Promise<void> {
    const element = document.createElement('div');
    element.textContent = this.title;
    container.appendChild(element);
  }
}

export { TestComponent };
export default TestComponent;
