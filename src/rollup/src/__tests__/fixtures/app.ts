import { Component } from '@closure-next/core';

export class AppComponent extends Component {
  title = 'App Component';

  constructor() {
    super();
  }

  renderToString() {
    return `<div>${this.title}</div>`;
  }
}

export default AppComponent;
