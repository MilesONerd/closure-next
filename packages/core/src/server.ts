/**
 * @fileoverview Server-side rendering support for Closure Next.
 * @license Apache-2.0
 */

import { Component } from './component';
import { DOMHelper } from './dom';
import { EventType } from './events';

export class ServerComponent extends Component {
  protected ssrEnabled: boolean;

  constructor(domHelper: DOMHelper) {
    super(domHelper);
    this.ssrEnabled = true;
  }

  async renderToString(): Promise<string> {
    if (!this.element) {
      this.element = this.domHelper.createElement('div');
      if (this.id) {
        this.element.id = this.id;
      }
      await this.createDom();
    }
    return this.element.outerHTML;
  }

  async hydrate(container?: HTMLElement): Promise<void> {
    if (!this.ssrEnabled) {
      throw new Error('SSR not enabled for this component');
    }
    if (container) {
      this.element = container.firstElementChild as HTMLElement;
      if (!this.element) {
        throw new Error('No element found for hydration');
      }
    } else if (this.id) {
      const element = this.domHelper.getElementById(this.id);
      if (element) {
        this.element = element as HTMLElement;
      }
    }
    await this.createDom();
    this.emit(EventType.STATECHANGE);
  }
}
