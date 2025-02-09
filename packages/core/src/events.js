/**
 * @fileoverview Event handling implementation for Closure Next.
 * @license Apache-2.0
 */
export const EventType = {
    ALL: 'all',
    STATECHANGE: 'statechange',
    DISPOSE: 'dispose',
    TEST: 'test'
};
export class EventTarget {
    constructor() {
        this.listeners = new Map();
        this.disposed = false;
        // Initialize ALL event type by default
        this.listeners.set(EventType.ALL, new Set());
    }
    addEventListener(type, listener) {
        if (this.disposed) {
            return;
        }
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type).add(listener);
    }
    removeEventListener(type, listener) {
        if (this.disposed) {
            return;
        }
        const listeners = this.listeners.get(type);
        if (listeners) {
            listeners.delete(listener);
            if (listeners.size === 0) {
                this.listeners.delete(type);
            }
        }
    }
    emit(type, data) {
        this.dispatchEvent(type, data);
    }
    dispatchEvent(type, data) {
        if (this.disposed) {
            return;
        }
        const event = {
            type,
            target: this,
            data
        };
        // Call specific event type listeners
        const typeListeners = this.listeners.get(type);
        if (typeListeners) {
            typeListeners.forEach(listener => {
                try {
                    listener(event);
                }
                catch (error) {
                    console.error('Error in event listener:', error);
                }
            });
        }
        // Call ALL event type listeners
        const allListeners = this.listeners.get(EventType.ALL);
        if (allListeners) {
            allListeners.forEach(listener => {
                try {
                    listener(event);
                }
                catch (error) {
                    console.error('Error in ALL event listener:', error);
                }
            });
        }
    }
    dispose() {
        if (this.disposed) {
            return;
        }
        this.dispatchEvent(EventType.DISPOSE);
        this.listeners.clear();
        this.disposed = true;
    }
    isDisposed() {
        return this.disposed;
    }
}
//# sourceMappingURL=events.js.map