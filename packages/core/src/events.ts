/**
 * @fileoverview Event handling system for Closure Next.
 * @license Apache-2.0
 */

/**
 * Base class for event targets that provides event handling capabilities
 */
export class EventTarget {
  protected listeners: Map<string, Set<(evt: Event) => void>> = new Map();

  /**
   * Adds an event listener
   */
  addEventListener(type: string, listener: (this: unknown, evt: Event) => void): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);
  }

  /**
   * Removes an event listener
   */
  removeEventListener(type: string, listener: (this: unknown, evt: Event) => void): void {
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
  dispatchEvent(event: Event): boolean {
    const type = event.type;
    const typeListeners = this.listeners.get(type);
    let defaultPrevented = event.defaultPrevented;

    if (typeListeners) {
      // Convert Set to Array to avoid modification during iteration
      const listeners = Array.from(typeListeners);
      for (const listener of listeners) {
        try {
          // Create a new event for each listener to prevent modification
          const listenerEvent = event instanceof CustomEvent ?
            new CustomEvent(event.type, {
              bubbles: event.bubbles,
              cancelable: event.cancelable,
              detail: event.detail
            }) :
            new Event(event.type, {
              bubbles: event.bubbles,
              cancelable: event.cancelable
            });
          
          // Copy standard event properties that are writable
          listenerEvent.cancelBubble = event.cancelBubble;
          listenerEvent.returnValue = event.returnValue;
          if (event.defaultPrevented) {
            listenerEvent.preventDefault();
          }
          if (event.cancelBubble) {
            listenerEvent.stopPropagation();
          }
          
          listener.call(this, listenerEvent);
          if (listenerEvent.defaultPrevented) {
            defaultPrevented = true;
          }
        } catch (e) {
          console.error('Error in event handler:', e);
        }
      }
    }

    return !defaultPrevented;
  }

  /**
   * Removes all event listeners
   */
  dispose(): void {
    // Clear all event listeners
    this.listeners.forEach((listeners) => {
      listeners.clear();
    });
    this.listeners.clear();

    // Reset state
    this.listeners = new Map();
  }
}
