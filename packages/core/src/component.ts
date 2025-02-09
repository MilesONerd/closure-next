/**
 * @fileoverview Base component class for Closure Next.
 * @license Apache-2.0
 */

import { EventTarget } from './events';
import { DomHelper } from './dom';
import { IdGenerator } from './id';
import type { ComponentEventMap, ComponentProps, ComponentState, EventHandler } from './types';

/**
 * Component states that affect rendering and behavior
 */
export const ComponentState = {
  ALL: 0xFF,
  DISABLED: 0x01,
  HOVER: 0x02,
  ACTIVE: 0x04,
  SELECTED: 0x08,
  CHECKED: 0x10,
  FOCUSED: 0x20,
  OPENED: 0x40
} as const;

export type ComponentStateValue = typeof ComponentState[keyof typeof ComponentState];

/**
 * Events dispatched by components
 */
export const ComponentEventType = {
  BEFORE_SHOW: 'beforeshow',
  SHOW: 'show',
  HIDE: 'hide',
  DISABLE: 'disable',
  ENABLE: 'enable',
  HIGHLIGHT: 'highlight',
  UNHIGHLIGHT: 'unhighlight',
  ACTIVATE: 'activate',
  DEACTIVATE: 'deactivate',
  SELECT: 'select',
  UNSELECT: 'unselect',
  CHECK: 'check',
  UNCHECK: 'uncheck',
  FOCUS: 'focus',
  BLUR: 'blur',
  OPEN: 'open',
  CLOSE: 'close',
  ENTER: 'enter',
  LEAVE: 'leave',
  ACTION: 'action',
  CHANGE: 'change'
} as const;

export type ComponentEventTypeValue = typeof ComponentEventType[keyof typeof ComponentEventType];

/**
 * Base component class with lifecycle management and DOM manipulation.
 */
export class Component<P extends ComponentProps = ComponentProps, S extends Record<string, unknown> = Record<string, unknown>> extends EventTarget {
  // Protected properties
  protected element: HTMLElement | null = null;
  protected children: Component[] = [];
  protected childIndex: Map<string, Component> = new Map();
  protected parent: Component | null = null;
  protected inDocument = false;
  protected wasDecorated = false;
  protected rightToLeft: boolean | null = null;
  protected pointerEventsEnabled = false;
  protected model: unknown = null;
  protected props: P = {} as P;
  protected state: S = {} as S;

  protected readonly domHelper: DomHelper;
  protected readonly idGenerator: IdGenerator;
  protected readonly domEventHandlers: Map<string, (evt: Event) => void> = new Map();

  // Public properties
  public id = '';

  constructor(domHelper?: DomHelper) {
    super();
    this.domHelper = domHelper || new DomHelper(document);
    this.idGenerator = IdGenerator.getInstance();
  }

  public getId(): string {
    if (this.id === '') {
      this.id = this.idGenerator.getNextUniqueId();
    }
    return this.id;
  }

  public setId(id: string): void {
    if (this.parent?.childIndex) {
      this.parent.childIndex.delete(this.id);
      this.parent.childIndex.set(id, this);
    }
    this.id = id;
  }

  public createDom(): void {
    if (!this.element) {
      this.element = this.domHelper.createElement('div');
      this.setupEventHandlers();
      this.children.forEach(child => {
        if (!child.getElement()) {
          child.createDom();
        }
      });
    }
  }

  protected setupEventHandlers(): void {
    if (!this.element) return;

    this.domEventHandlers.forEach((handler, type) => {
      this.domHelper.removeEventListener(this.element!, type, handler, true);
    });
    this.domEventHandlers.clear();

    this.listeners.forEach((listeners, type) => {
      if (listeners.size > 0) {
        const handler = (evt: Event) => {
          evt.stopPropagation();
          const listenerEvent = this.cloneEvent(evt);
          listeners.forEach(listener => {
            try {
              listener.call(this, listenerEvent);
            } catch (e) {
              console.error('Error in event handler:', e);
            }
          });
        };
        this.domEventHandlers.set(type, handler);
        this.domHelper.addEventListener(this.element!, type, handler, true);
      }
    });
  }

  public addEventListener<K extends keyof ComponentEventMap>(
    type: K,
    listener: EventHandler<ComponentEventMap[K]>
  ): void {
    super.addEventListener(type, listener);
    if (this.element) {
      this.setupEventHandlers();
    }
  }

  public removeEventListener<K extends keyof ComponentEventMap>(
    type: K,
    listener: EventHandler<ComponentEventMap[K]>
  ): void {
    super.removeEventListener(type, listener);
    if (this.element) {
      this.setupEventHandlers();
    }
  }

  public render(opt_parentElement?: HTMLElement): void {
    if (!this.element) {
      this.createDom();
    }

    if (!this.element) {
      throw new Error('Failed to create DOM element');
    }

    if (this.inDocument) {
      if (this.element.parentElement) {
        this.domHelper.removeNode(this.element);
      }
      const parent = (opt_parentElement || document.body) as HTMLElement;
      this.domHelper.appendChild(parent, this.element);
      return;
    }

    const parent = (opt_parentElement || document.body) as HTMLElement;
    this.domHelper.appendChild(parent, this.element);
    this.inDocument = true;
    this.attachChildren();
    this.children.forEach(child => {
      if (!child.isInDocument()) {
        child.enterDocument();
      }
    });
  }

  protected attachChildren(): void {
    if (!this.element) return;

    this.children.forEach(child => {
      const childElement = child.getElement();
      if (childElement && (!childElement.parentElement || childElement.parentElement !== this.element)) {
        this.domHelper.appendChild(this.element!, childElement);
      }
    });
  }

  public dispose(): void {
    if (this.inDocument) {
      this.exitDocument();
    }

    const elementRef = this.element;
    const childrenToDispose = [...this.children];
    const parentRef = this.parent;

    if (elementRef) {
      this.domEventHandlers.forEach((handler, type) => {
        this.domHelper.removeEventListener(elementRef, type, handler, true);
      });
      this.domEventHandlers.clear();

      if (!this.wasDecorated && elementRef.parentElement) {
        elementRef.parentElement.removeChild(elementRef);
      }
    }

    this.listeners.clear();
    childrenToDispose.forEach(child => {
      if (child.parent === this) {
        child.setParent(null);
      }
      child.dispose();
    });

    if (parentRef) {
      const index = parentRef.children.indexOf(this);
      if (index !== -1) {
        parentRef.children.splice(index, 1);
      }
      parentRef.childIndex.delete(this.id);
    }

    this.element = null;
    this.children = [];
    this.childIndex.clear();
    this.parent = null;
    this.model = null;
    this.inDocument = false;
    this.wasDecorated = false;
    this.rightToLeft = null;
    this.pointerEventsEnabled = false;
    this.id = '';
  }

  public enterDocument(): void {
    if (!this.element) {
      this.createDom();
    }

    if (!this.element) {
      throw new Error('Failed to create DOM element');
    }

    this.inDocument = true;
    this.children.forEach(child => {
      if (!child.getElement()) {
        child.createDom();
      }

      const childElement = child.getElement();
      if (childElement) {
        if (!childElement.parentElement && this.element) {
          this.domHelper.appendChild(this.element, childElement);
        }
        if (childElement.parentElement === this.element) {
          child.inDocument = true;
          child.enterDocument();
        }
      }
    });
  }

  public exitDocument(): void {
    this.children.forEach(child => {
      if (child.isInDocument()) {
        child.exitDocument();
      }
    });
    this.inDocument = false;
  }

  public addChild(child: Component): void {
    if (child.parent === this) return;

    if (child.parent) {
      child.parent.removeChild(child);
    }

    this.children.push(child);
    child.setParent(this);

    if (child.id) {
      this.childIndex.set(child.id, child);
    }

    if (this.inDocument && this.element) {
      const childElement = child.getElement();
      if (childElement && (!childElement.parentElement || childElement.parentElement !== this.element)) {
        this.domHelper.appendChild(this.element, childElement);
      }
      child.inDocument = true;
      child.enterDocument();
    }
  }

  public removeChild(child: Component): void {
    if (child.parent !== this) return;

    if (child.isInDocument()) {
      child.exitDocument();
    }

    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
    }

    if (child.id) {
      this.childIndex.delete(child.id);
    }

    child.parent = null;
  }

  protected setParent(parent: Component | null): void {
    if (parent === this) {
      throw new Error('Cannot set parent to self');
    }

    if (this.parent && this.parent !== parent) {
      const index = this.parent.children.indexOf(this);
      if (index !== -1) {
        this.parent.children.splice(index, 1);
      }
      if (this.id) {
        this.parent.childIndex.delete(this.id);
      }
    }

    this.parent = parent;

    if (parent) {
      if (!parent.children.includes(this)) {
        parent.children.push(this);
        if (this.id) {
          parent.childIndex.set(this.id, this);
        }
      }

      if (parent.inDocument) {
        this.inDocument = true;
        this.enterDocument();
      }
    }
  }

  public getElement(): HTMLElement | null {
    return this.element;
  }

  public isInDocument(): boolean {
    return this.inDocument;
  }

  public getParent(): Component | null {
    return this.parent;
  }

  public getProps(): P {
    return this.props;
  }

  public setState(state: Partial<S>): void {
    this.state = { ...this.state, ...state };
  }

  public getState(): S {
    return this.state;
  }
}
