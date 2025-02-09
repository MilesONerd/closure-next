/**
 * @fileoverview Component implementation for Closure Next.
 * @license Apache-2.0
 */
import { DOMHelper } from './dom';
import { EventTarget } from './events';
import type { ComponentInterface, ComponentState } from './types';
export declare class Component extends EventTarget implements ComponentInterface {
    protected domHelper: DOMHelper;
    protected element: HTMLElement | null;
    protected id: string;
    protected parent: ComponentInterface | null;
    protected children: Set<ComponentInterface>;
    protected state: ComponentState;
    constructor(domHelper: DOMHelper);
    getId(): string;
    setId(id: string): void;
    getElement(): HTMLElement | null;
    addChild(child: ComponentInterface): void;
    removeChild(child: ComponentInterface): void;
    getParent(): ComponentInterface | null;
    getChildren(): ComponentInterface[];
    getState(): ComponentState;
    setState(state: ComponentState): Promise<void>;
    protected createDom(): Promise<void>;
    render(container: HTMLElement): Promise<void>;
    renderToString(): Promise<string>;
    hydrate(container?: HTMLElement): Promise<void>;
    dispose(): void;
}
//# sourceMappingURL=component.d.ts.map