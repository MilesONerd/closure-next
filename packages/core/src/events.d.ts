/**
 * @fileoverview Event handling system for Closure Next.
 * @license Apache-2.0
 */
/**
 * Base class for event targets that provides event handling capabilities
 */
export declare class EventTarget {
    private listeners;
    /**
     * Adds an event listener
     */
    addEventListener(type: string, listener: Function): void;
    /**
     * Removes an event listener
     */
    removeEventListener(type: string, listener: Function): void;
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
