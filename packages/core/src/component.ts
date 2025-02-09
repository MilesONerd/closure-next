import { DomHelper } from './dom';
import { EventEmitter } from './events';
import {
  ComponentProps,
  ComponentStateInterface,
  ComponentEventMap,
  ComponentStateFlags
} from './types';

export class Component extends EventEmitter {
  protected element: HTMLElement | null = null;
  protected props: ComponentProps = {};
  protected state: ComponentStateInterface = {};
  protected stateFlags: ComponentStateFlags = ComponentStateFlags.UNINITIALIZED;
  
  constructor(protected readonly domHelper: DomHelper) {
    super();
  }

  protected createDom(): void {
    // Default implementation
  }

  async render(container: HTMLElement): Promise<void> {
    this.stateFlags = ComponentStateFlags.RENDERING;
    this.createDom();
    if (this.element) {
      container.appendChild(this.element);
    }
    this.stateFlags = ComponentStateFlags.RENDERED;
  }

  getElement(): HTMLElement | null {
    return this.element;
  }

  isInDocument(): boolean {
    return !!(this.element && this.element.parentElement);
  }

  dispose(): void {
    this.stateFlags = ComponentStateFlags.DISPOSING;
    if (this.element && this.element.parentElement) {
      this.element.parentElement.removeChild(this.element);
    }
    this.element = null;
    this.clear();
    this.stateFlags = ComponentStateFlags.DISPOSED;
  }
}
