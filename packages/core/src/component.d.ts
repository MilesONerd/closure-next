import { DomHelper } from './dom';
import { EventTarget } from './events';
import { ComponentStateFlags } from './types';
import type { ComponentProps, ComponentStateInterface } from './types';
export declare class Component<P extends ComponentProps = ComponentProps, S extends ComponentStateInterface = ComponentStateInterface> extends EventTarget {
    protected readonly domHelper: DomHelper;
    protected stateFlags: ComponentStateFlags;
    protected element: HTMLElement | null;
    protected children: Component[];
    protected childIndex: number;
    protected parent: Component | null;
    protected props: P;
    protected state: S;
    constructor(domHelper: DomHelper);
    getId(): string;
    setId(id: string): void;
    getElement(): HTMLElement | null;
    isInDocument(): boolean;
    getParent(): Component | null;
    render(opt_parentElement?: HTMLElement): void;
    dispose(): void;
    enterDocument(): void;
    exitDocument(): void;
    addChild(child: Component): void;
    removeChild(child: Component): void;
    protected createDom(): void;
    protected setState(state: Partial<S>): void;
    protected getState(): S;
    protected setProps(props: Partial<P>): void;
    protected getProps(): P;
}
//# sourceMappingURL=component.d.ts.map