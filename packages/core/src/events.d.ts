import type { ComponentEventMap, EventHandler } from './types';
export declare class EventTarget {
    protected readonly listeners: Map<string, Set<EventHandler>>;
    addEventListener<K extends keyof ComponentEventMap>(type: K, listener: EventHandler<ComponentEventMap[K]>): void;
    removeEventListener<K extends keyof ComponentEventMap>(type: K, listener: EventHandler<ComponentEventMap[K]>): void;
    dispatchEvent<K extends keyof ComponentEventMap>(event: ComponentEventMap[K]): boolean;
    protected cloneEvent<K extends keyof ComponentEventMap>(event: ComponentEventMap[K]): ComponentEventMap[K];
}
//# sourceMappingURL=events.d.ts.map