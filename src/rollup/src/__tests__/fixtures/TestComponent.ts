import { Component } from '@closure-next/core';

class TestComponent extends Component {
  title = 'Test Component';

  constructor() {
    super();
  }

  renderToString() {
    return `<div>${this.title}</div>`;
  }
}

export { TestComponent };
export default TestComponent;
