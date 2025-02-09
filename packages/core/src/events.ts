import type { ComponentEventMap, EventHandler } from './types';

export class EventTarget {
  protected readonly listeners: Map<keyof ComponentEventMap, Set<EventHandler>> = new Map();

  public addEventListener<K extends keyof ComponentEventMap>(
    type: K,
    listener: EventHandler<ComponentEventMap[K]>
  ): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener as EventHandler);
  }

  public removeEventListener<K extends keyof ComponentEventMap>(
    type: K,
    listener: EventHandler<ComponentEventMap[K]>
  ): void {
    const listeners = this.listeners.get(type);
    if (listeners) {
      listeners.delete(listener as EventHandler);
      if (listeners.size === 0) {
        this.listeners.delete(type);
      }
    }
  }

  public dispatchEvent(event: Event): boolean {
    const typeListeners = this.listeners.get(event.type as keyof ComponentEventMap);
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
        } catch (e) {
          console.error('Error in event handler:', e);
        }
      }
    }

    return !defaultPrevented;
  }

  protected cloneEvent(event: Event): Event {
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
