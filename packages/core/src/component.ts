/**
 * @fileoverview Component implementation for Closure Next.
 * @license Apache-2.0
 */

import { DOMHelper } from './dom';
import { EventTarget, EventType } from './events';
import type { ComponentInterface, ComponentState } from './types';

export class Component extends EventTarget implements ComponentInterface {
  protected domHelper: DOMHelper;
  protected element: HTMLElement | null;
  protected id: string;
  protected parent: ComponentInterface | null;
  protected children: Set<ComponentInterface>;
  protected state: ComponentState;

  constructor(domHelper: DOMHelper) {
    super();
    this.domHelper = domHelper;
    this.element = null;
    this.id = '';
    this.parent = null;
    this.children = new Set();
    this.state = {};
  }

  getId(): string {
    return this.id;
  }

  setId(id: string): void {
    this.id = id;
    if (this.element) {
      this.element.id = id;
      const parent = this.element.parentNode as HTMLElement;
      if (parent) {
        parent.id = id;
      }
    }
  }

  getElement(): HTMLElement | null {
    return this.element;
  }

  addChild(child: ComponentInterface): void {
    this.children.add(child);
    (child as Component).parent = this;
  }

  removeChild(child: ComponentInterface): void {
    this.children.delete(child);
    (child as Component).parent = null;
  }

  getParent(): ComponentInterface | null {
    return this.parent;
  }

  getChildren(): ComponentInterface[] {
    return Array.from(this.children);
  }

  getState(): ComponentState {
    return { ...this.state };
  }

  async setState(state: ComponentState): Promise<void> {
    const oldState = { ...this.state };
    this.state = { ...oldState, ...state };
    
    // Only emit and re-render if state actually changed
    if (JSON.stringify(oldState) !== JSON.stringify(this.state)) {
      // Emit state change event before rendering
      this.emit(EventType.STATECHANGE, { ...this.state });
      // Re-render if element exists and has a parent
      if (this.element && this.element.parentNode) {
        // Store current parent
        const parent = this.element.parentNode as HTMLElement;
        // Re-create DOM with new state
        await this.createDom();
        // Re-render in parent
        await this.render(parent);
      }
    }
  }

  protected async createDom(): Promise<void> {
    if (!this.element) {
      this.element = this.domHelper.createElement('div');
      if (this.id) {
        this.element.id = this.id;
      }
    }
  }

  async render(container: HTMLElement): Promise<void> {
    if (!this.element) {
      await this.createDom();
    }
    if (container && this.element) {
      // Remove from old parent if needed
      if (this.element.parentNode && this.element.parentNode !== container) {
        this.element.parentNode.removeChild(this.element);
      }
      // Add to new parent if needed
      if (!this.element.parentNode) {
        container.appendChild(this.element);
      }
      // Update IDs
      if (this.id) {
        this.element.id = this.id;
        container.id = this.id;
      }
      // Render children
      const renderPromises = Array.from(this.children).map(child => child.render(this.element!));
      await Promise.all(renderPromises);
      // Emit state change event after rendering
      this.emit(EventType.STATECHANGE, { ...this.state });
    }
  }

  async renderToString(): Promise<string> {
    if (!this.element) {
      await this.createDom();
    }
    return this.element?.outerHTML || '';
  }

  async hydrate(container?: HTMLElement): Promise<void> {
    if (container) {
      const element = container.firstElementChild as HTMLElement;
      if (element) {
        this.element = element;
      }
    } else if (this.id) {
      const element = this.domHelper.getElementById(this.id);
      if (element) {
        this.element = element as HTMLElement;
      }
    }
  }

  dispose(): void {
    if (this.isDisposed()) {
      return;
    }

    this.children.forEach(child => child.dispose());
    this.children.clear();

    if (this.parent) {
      this.parent.removeChild(this);
    }

    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    this.element = null;
    this.emit(EventType.DISPOSE);
    super.dispose();
  }
}
