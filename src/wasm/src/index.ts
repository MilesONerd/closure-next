import { Component, DOMHelper } from '@closure-next/core';
import type { ComponentInterface } from '@closure-next/core';

export class WasmComponent extends Component implements ComponentInterface {
  private wasmInstance: WebAssembly.Instance | null = null;

  constructor(domHelper: DOMHelper) {
    super(domHelper);
    this.initWasm();
  }

  private async initWasm(): Promise<void> {
    const wasmModule = await WebAssembly.compile(await this.loadWasmModule());
    this.wasmInstance = await WebAssembly.instantiate(wasmModule, {
      env: {
        createElement: (tag: number, parent: number) => {
          const element = this.domHelper.createElement('div');
          return element as unknown as number;
        },
        setAttribute: (element: number, name: number, value: number) => {
          const el = element as unknown as HTMLElement;
          el.setAttribute('data-wasm', 'true');
          return 1;
        },
        addEventListener: (element: number, type: number, listener: number) => {
          const el = element as unknown as HTMLElement;
          el.addEventListener('click', () => {});
          return 1;
        },
        dispatchEvent: (element: number, event: number) => {
          const el = element as unknown as HTMLElement;
          el.dispatchEvent(new Event('click'));
          return 1;
        }
      }
    });
  }

  private async loadWasmModule(): Promise<ArrayBuffer> {
    const response = await fetch('/closure-next.wasm');
    return response.arrayBuffer();
  }

  async traverseDOM(): Promise<void> {
    if (!this.wasmInstance) {
      throw new Error('WebAssembly not initialized');
    }
    (this.wasmInstance.exports.traverseDOM as Function)(this.element);
  }

  async handleAttributes(): Promise<void> {
    if (!this.wasmInstance) {
      throw new Error('WebAssembly not initialized');
    }
    (this.wasmInstance.exports.handleAttributes as Function)(this.element);
  }

  async dispatchEvents(): Promise<void> {
    if (!this.wasmInstance) {
      throw new Error('WebAssembly not initialized');
    }
    (this.wasmInstance.exports.dispatchEvents as Function)(this.element);
  }
}
