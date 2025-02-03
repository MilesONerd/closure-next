/**
 * @fileoverview Base component class for Closure Next.
 * Modernized version of the original Closure Library component.
 * @license Apache-2.0
 */
import { EventTarget } from './events';
import { DomHelper } from './dom';
import { IdGenerator } from './id';
/**
 * Component states that affect rendering and behavior
 */
export declare const ComponentState: {
    readonly ALL: 255;
    readonly DISABLED: 1;
    readonly HOVER: 2;
    readonly ACTIVE: 4;
    readonly SELECTED: 8;
    readonly CHECKED: 16;
    readonly FOCUSED: 32;
    readonly OPENED: 64;
};
export type ComponentStateType = typeof ComponentState[keyof typeof ComponentState];
/**
 * Events dispatched by components
 */
export declare const ComponentEventType: {
    readonly BEFORE_SHOW: "beforeshow";
    readonly SHOW: "show";
    readonly HIDE: "hide";
    readonly DISABLE: "disable";
    readonly ENABLE: "enable";
    readonly HIGHLIGHT: "highlight";
    readonly UNHIGHLIGHT: "unhighlight";
    readonly ACTIVATE: "activate";
    readonly DEACTIVATE: "deactivate";
    readonly SELECT: "select";
    readonly UNSELECT: "unselect";
    readonly CHECK: "check";
    readonly UNCHECK: "uncheck";
    readonly FOCUS: "focus";
    readonly BLUR: "blur";
    readonly OPEN: "open";
    readonly CLOSE: "close";
    readonly ENTER: "enter";
    readonly LEAVE: "leave";
    readonly ACTION: "action";
    readonly CHANGE: "change";
};
export type ComponentEventType = typeof ComponentEventType[keyof typeof ComponentEventType];
/**
 * Base component class with lifecycle management and DOM manipulation.
 * Provides core functionality for all UI components including:
 * - DOM creation and management
 * - Event handling
 * - Parent-child relationships
 * - Lifecycle management
 * @extends {EventTarget}
 */
export type ComponentConstructor<T extends Component> = new (domHelper: DomHelper) => T;
export interface ComponentInterface {
    getId(): string;
    setId(id: string): void;
    getElement(): HTMLElement | null;
    isInDocument(): boolean;
    getParent(): Component | null;
    render(opt_parentElement?: HTMLElement): void;
    dispose(): void;
    enterDocument(): void;
    exitDocument(): void;
    addChild(child: Component): void;
    removeChild(child: Component): void;
    addEventListener(type: string, listener: (this: unknown, evt: Event) => void): void;
    removeEventListener(type: string, listener: (this: unknown, evt: Event) => void): void;
    dispatchEvent(event: Event): boolean;
    /**
     * Creates the DOM element for this component.
     * @public
     */
    createDom(): void;
    /**
     * Called when component enters the document.
     * @public
     */
    enterDocument(): void;
    /**
     * Called when component exits the document.
     * @public
     */
    exitDocument(): void;
}
export declare class Component extends EventTarget implements ComponentInterface {
    protected element: HTMLElement | null;
    protected children: Component[];
    protected childIndex: Map<string, Component>;
    protected parent: Component | null;
    protected inDocument: boolean;
    protected wasDecorated: boolean;
    protected rightToLeft: boolean | null;
    protected pointerEventsEnabled: boolean;
    protected model: unknown;
    protected readonly domHelper: DomHelper;
    protected readonly idGenerator: IdGenerator;
    protected readonly domEventHandlers: Map<string, (evt: Event) => void>;
    protected readonly listeners: Map<string, Set<(evt: Event) => void>>;
    id: string;
    constructor(domHelper?: DomHelper);
    /**
     * Gets the unique ID for this component.
     * @return The component's unique ID.
     * @public
     */
    getId(): string;
    /**
     * Sets the ID of this component.
     * @param id The new ID for the component.
     * @public
     */
    setId(id: string): void;
    /**
     * Creates the DOM element for this component.
     * @public
     */
    createDom(): void;
    protected attachChildren(): void;
    protected setupDomEventHandler(type: string): void;
    /**
     * Renders the component into the DOM.
     * @param opt_parentElement Optional parent element to render into.
     * @throws {Error} If the component is already rendered.
     * @public
     */
    render(opt_parentElement?: HTMLElement): void;
    private ensureInDocument;
    protected setParent(parent: Component | null): void;
    dispose(): void;
    /**
     * Called when component enters the document.
     * @public
     */
    enterDocument(): void;
    /**
     * Adds an event listener to the component.
     * @param type The event type to listen for.
     * @param listener The event handler function.
     * @public
     */
    addEventListener(type: string, listener: (this: unknown, evt: Event) => void): void;
    /**
     * Removes an event listener from the component.
     * @param type The event type to stop listening for.
     * @param listener The event handler function to remove.
     * @public
     */
    removeEventListener(type: string, listener: (this: unknown, evt: Event) => void): void;
    /**
     * Dispatches an event on this component.
     * @param event The event to dispatch.
     * @return Whether the event's default action was prevented.
     * @public
     */
    dispatchEvent(event: Event): boolean;
    /**
     * Called when component exits the document.
     * @public
     */
    exitDocument(): void;
    /**
     * Adds the specified component as a child of this component.
     * @param child The new child component.
     * @throws {Error} If the child element cannot be created.
     * @public
     */
    addChild(child: Component): void;
    /**
     * Removes the specified child component from this component.
     * @param child The child component to remove.
     * @public
     */
    removeChild(child: Component): void;
    /**
     * Gets the DOM element associated with this component.
     * @return The component's element or null if not created.
     * @public
     */
    getElement(): HTMLElement | null;
    /**
     * Returns whether the component is in the document.
     * @return True if the component is in the document.
     * @public
     */
    isInDocument(): boolean;
    /**
     * Gets the parent component.
     * @return The parent component or null if none.
     * @public
     */
    getParent(): Component | null;
}
//# sourceMappingURL=component.d.ts.map