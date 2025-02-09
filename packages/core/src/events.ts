import { Component } from './component';
import type { ComponentEventMap, EventHandler } from './types';

export class EventTarget {
  protected readonly listeners: Map<string, Set<EventHandler>> = new Map();

  public addEventListener<K extends keyof ComponentEventMap>(
    type: K,
    listener: EventHandler<ComponentEventMap[K]>
  ): void {
    if (!this.listeners.has(type as string)) {
      this.listeners.set(type as string, new Set());
    }
    this.listeners.get(type as string)!.add(listener as EventHandler);
  }

  public removeEventListener<K extends keyof ComponentEventMap>(
    type: K,
    listener: EventHandler<ComponentEventMap[K]>
  ): void {
    const listeners = this.listeners.get(type as string);
    if (listeners) {
      listeners.delete(listener as EventHandler);
      if (listeners.size === 0) {
        this.listeners.delete(type as string);
      }
    }
  }

  public dispatchEvent<K extends keyof ComponentEventMap>(event: ComponentEventMap[K]): boolean {
    const typeListeners = this.listeners.get(event.type);
    let defaultPrevented = event.defaultPrevented;

    if (typeListeners) {
      const listeners = Array.from(typeListeners);
      for (const listener of listeners) {
        try {
          const listenerEvent = this.cloneEvent(event);
          listener.call(this as unknown as Component, listenerEvent as ComponentEventMap[K]);
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

  protected cloneEvent<K extends keyof ComponentEventMap>(event: ComponentEventMap[K]): ComponentEventMap[K] {
    if (event instanceof CustomEvent) {
      return new CustomEvent(event.type, {
        bubbles: event.bubbles,
        cancelable: event.cancelable,
        detail: event.detail
      }) as ComponentEventMap[K];
    }
    return new Event(event.type, {
      bubbles: event.bubbles,
      cancelable: event.cancelable
    }) as ComponentEventMap[K];
  }
}
