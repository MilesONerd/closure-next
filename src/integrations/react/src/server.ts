import { Component, DOMHelper } from '@closure-next/core';
import type { ComponentInterface } from '@closure-next/core';

export class ServerComponent extends Component implements ComponentInterface {
  private ssrEnabled: boolean = true;

  constructor(domHelper: DOMHelper) {
    super(domHelper);
  }

  async renderToString(): Promise<string> {
    if (!this.ssrEnabled) {
      throw new Error('SSR not enabled for this component');
    }
    if (!this.element) {
      await this.createDom();
    }
    return this.element?.outerHTML || '';
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
  }

  enableSSR(): void {
    this.ssrEnabled = true;
  }

  disableSSR(): void {
    this.ssrEnabled = false;
  }

  isSSREnabled(): boolean {
    return this.ssrEnabled;
  }
}
