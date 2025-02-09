import type { ComponentEventMap } from './types';

export type EventHandler<T = any> = (event: T) => void;

export class EventEmitter<T extends ComponentEventMap = ComponentEventMap> {
  private handlers: Map<keyof T, Set<EventHandler>> = new Map();

  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  clear(): void {
    this.handlers.clear();
  }
}
