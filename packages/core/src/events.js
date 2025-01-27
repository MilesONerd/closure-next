/**
 * @fileoverview Event handling system for Closure Next.
 * @license Apache-2.0
 */
/**
 * Base class for event targets that provides event handling capabilities
 */
export class EventTarget {
    constructor() {
        this.listeners = new Map();
    }
    /**
     * Adds an event listener
     */
    addEventListener(type, listener) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type).add(listener);
    }
    /**
     * Removes an event listener
     */
    removeEventListener(type, listener) {
        const typeListeners = this.listeners.get(type);
        if (typeListeners) {
            typeListeners.delete(listener);
            if (typeListeners.size === 0) {
                this.listeners.delete(type);
            }
        }
    }
    /**
     * Dispatches an event
     */
    dispatchEvent(event) {
        const type = event.type;
        const typeListeners = this.listeners.get(type);
        if (!typeListeners) {
            return true;
        }
        typeListeners.forEach(listener => {
            try {
                listener.call(this, event);
            }
            catch (e) {
                console.error('Error in event handler:', e);
            }
        });
        return !event.defaultPrevented;
    }
    /**
     * Removes all event listeners
     */
    dispose() {
        this.listeners.clear();
    }
}
//# sourceMappingURL=events.js.map
