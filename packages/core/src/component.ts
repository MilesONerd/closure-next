import { DomHelper } from './dom';
import { EventTarget } from './events';
import { ComponentStateFlags } from './types';
import type {
  ComponentProps,
  ComponentStateInterface,
  ComponentEventMap,
  EventHandler
} from './types';

export class Component<
  P extends ComponentProps = ComponentProps,
  S extends ComponentStateInterface = ComponentStateInterface
> extends EventTarget {
  protected stateFlags: ComponentStateFlags = ComponentStateFlags.NONE;
  protected element: HTMLElement | null = null;
  protected children: Component[] = [];
  protected childIndex: number = -1;
  protected parent: Component | null = null;
  protected props: P = {} as P;
  protected state: S = {} as S;

  constructor(protected readonly domHelper: DomHelper) {
    super();
  }

  public getId(): string {
    return this.element?.id || '';
  }

  public setId(id: string): void {
    if (this.element) {
      this.element.id = id;
    }
  }

  public getElement(): HTMLElement | null {
    return this.element;
  }

  public isInDocument(): boolean {
    return !!this.element && document.contains(this.element);
  }

  public getParent(): Component | null {
    return this.parent;
  }

  public render(opt_parentElement?: HTMLElement): void {
    if (!this.element) {
      this.createDom();
    }
    if (opt_parentElement && this.element) {
      opt_parentElement.appendChild(this.element);
    }
  }

  public dispose(): void {
    this.exitDocument();
    this.element = null;
    this.children.forEach(child => child.dispose());
    this.children = [];
  }

  public enterDocument(): void {
    this.children.forEach(child => child.enterDocument());
  }

  public exitDocument(): void {
    this.children.forEach(child => child.exitDocument());
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  public addChild(child: Component): void {
    child.parent = this;
    child.childIndex = this.children.length;
    this.children.push(child);
  }

  public removeChild(child: Component): void {
    const index = this.children.indexOf(child);
    if (index > -1) {
      child.exitDocument();
      child.parent = null;
      child.childIndex = -1;
      this.children.splice(index, 1);
    }
  }

  protected createDom(): void {
    // Override in subclasses
  }

  protected setState(state: Partial<S>): void {
    this.state = { ...this.state, ...state };
    if (this.isInDocument()) {
      this.exitDocument();
      this.enterDocument();
    }
  }

  protected getState(): S {
    return this.state;
  }

  protected setProps(props: Partial<P>): void {
    this.props = { ...this.props, ...props };
    if (this.isInDocument()) {
      this.exitDocument();
      this.enterDocument();
    }
  }

  protected getProps(): P {
    return this.props;
  }
}
