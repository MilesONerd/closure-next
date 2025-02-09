import { Component, DOMHelper } from '@closure-next/core';

export class AppComponent extends Component {
  title = 'App Component';

  constructor(domHelper: DOMHelper) {
    super(domHelper);
  }

  async render(container: HTMLElement): Promise<void> {
    const element = document.createElement('div');
    element.textContent = this.title;
    container.appendChild(element);
  }
}

export default AppComponent;
