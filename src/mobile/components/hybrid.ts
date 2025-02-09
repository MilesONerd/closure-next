import { MobileComponent } from './mobile';
import type { Component } from '@closure-next/core';
import type { MobileComponentOptions } from '../types';

export class HybridComponent extends MobileComponent {
  constructor(ComponentClass: new () => Component, options: MobileComponentOptions = {}) {
    super(ComponentClass, options);
    this.setupHybridBridge();
  }

  private setupHybridBridge(): void {
    window.addEventListener('message', (event) => {
      this.handleNativeMessage(event.data);
    });
  }

  private handleNativeMessage(data: any): void {
    const element = this.getElement();
    if (!element) return;

    const event = new CustomEvent('native-message', {
      detail: data
    });
    element.dispatchEvent(event);
  }

  protected sendToNative(message: any): void {
    if (window.webkit?.messageHandlers?.closureNext) {
      window.webkit.messageHandlers.closureNext.postMessage(message);
    } else if ((window as any).closureNext) {
      (window as any).closureNext.postMessage(JSON.stringify(message));
    }
  }
}
