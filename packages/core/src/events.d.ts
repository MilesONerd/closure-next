/**
 * @fileoverview Event handling implementation for Closure Next.
 * @license Apache-2.0
 */
import type { EventInterface, EventTargetInterface } from './types';
export declare const EventType: {
    readonly ALL: "all";
    readonly STATECHANGE: "statechange";
    readonly DISPOSE: "dispose";
    readonly TEST: "test";
};
export type EventType = typeof EventType[keyof typeof EventType];
export declare class EventTarget implements EventTargetInterface {
    private listeners;
    private disposed;
    constructor();
    addEventListener(type: EventType | string, listener: (event: EventInterface) => void): void;
    removeEventListener(type: EventType | string, listener: (event: EventInterface) => void): void;
    emit(type: EventType | string, data?: any): void;
    dispatchEvent(type: EventType | string, data?: any): void;
    dispose(): void;
    isDisposed(): boolean;
}
//# sourceMappingURL=events.d.ts.map