/**
 * @fileoverview Type definitions for Closure Next.
 * @license Apache-2.0
 */
import { EventType } from './events';
export interface EventInterface {
    type: EventType | string;
    target: EventTargetInterface;
    data?: any;
}
export interface EventTargetInterface {
    addEventListener(type: EventType | string, listener: (event: any) => void): void;
    removeEventListener(type: EventType | string, listener: (event: any) => void): void;
    dispatchEvent(type: EventType | string, event?: any): void;
    emit(type: EventType | string, data?: any): void;
    dispose(): void;
    isDisposed(): boolean;
}
export interface ComponentState {
    [key: string]: any;
}
export interface ComponentInterface extends EventTargetInterface {
    getId(): string;
    setId(id: string): void;
    addChild(child: ComponentInterface): void;
    removeChild(child: ComponentInterface): void;
    getParent(): ComponentInterface | null;
    getChildren(): ComponentInterface[];
    getState(): ComponentState;
    setState(state: ComponentState): Promise<void>;
    render(container: HTMLElement): Promise<void>;
    renderToString(): Promise<string>;
    hydrate(): Promise<void>;
}
export interface BundleInterface {
    load(): Promise<void>;
    unload(): Promise<void>;
    isLoaded(): boolean;
    getModule<T>(name: string): Promise<T>;
    hasModule(name: string): boolean;
}
//# sourceMappingURL=types.d.ts.map