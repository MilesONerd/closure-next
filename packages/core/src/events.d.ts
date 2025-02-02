/**
 * @fileoverview Event handling system for Closure Next.
 * @license Apache-2.0
 */
/**
 * Base class for event targets that provides event handling capabilities
 */
export declare class EventTarget {
    protected listeners: Map<string, Set<(evt: Event) => void>>;
    /**
     * Adds an event listener
     */
    addEventListener(type: string, listener: (this: unknown, evt: Event) => void): void;
    /**
     * Removes an event listener
     */
    removeEventListener(type: string, listener: (this: unknown, evt: Event) => void): void;
    /**
     * Dispatches an event
     */
    dispatchEvent(event: Event): boolean;
    /**
     * Removes all event listeners
     */
    dispose(): void;
}
//# sourceMappingURL=events.d.ts.map