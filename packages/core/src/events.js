"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventTarget = void 0;
class EventTarget {
    constructor() {
        this.listeners = new Map();
    }
    addEventListener(type, listener) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type).add(listener);
    }
    removeEventListener(type, listener) {
        const listeners = this.listeners.get(type);
        if (listeners) {
            listeners.delete(listener);
            if (listeners.size === 0) {
                this.listeners.delete(type);
            }
        }
    }
    dispatchEvent(event) {
        const typeListeners = this.listeners.get(event.type);
        let defaultPrevented = event.defaultPrevented;
        if (typeListeners) {
            const listeners = Array.from(typeListeners);
            for (const listener of listeners) {
                try {
                    const listenerEvent = this.cloneEvent(event);
                    listener.call(this, listenerEvent);
                    if (listenerEvent.defaultPrevented) {
                        defaultPrevented = true;
                    }
                }
                catch (e) {
                    console.error('Error in event handler:', e);
                }
            }
        }
        return !defaultPrevented;
    }
    cloneEvent(event) {
        if (event instanceof CustomEvent) {
            return new CustomEvent(event.type, {
                bubbles: event.bubbles,
                cancelable: event.cancelable,
                detail: event.detail
            });
        }
        return new Event(event.type, {
            bubbles: event.bubbles,
            cancelable: event.cancelable
        });
    }
}
exports.EventTarget = EventTarget;
//# sourceMappingURL=events.js.map