import { Component, DOMHelper } from '@closure-next/core';
import type { ComponentInterface } from '@closure-next/core';

export class ServerComponent extends Component implements ComponentInterface {
  constructor(domHelper: DOMHelper) {
    super(domHelper);
  }

  async renderToString(): Promise<string> {
    if (!this.element) {
      await this.createDom();
    }
    return this.element?.outerHTML || '';
  }

  async hydrate(): Promise<void> {
    await this.createDom();
  }
}
