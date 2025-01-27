/**
 * @fileoverview Base component class for Closure Next.
 * Modernized version of the original Closure Library component.
 * @license Apache-2.0
 */
import { EventTarget } from './events';
import { DomHelper } from './dom';
/**
 * Component states that affect rendering and behavior
 */
export declare enum ComponentState {
    ALL = 255,
    DISABLED = 1,
    HOVER = 2,
    ACTIVE = 4,
    SELECTED = 8,
    CHECKED = 16,
    FOCUSED = 32,
    OPENED = 64
}
/**
 * Events dispatched by components
 */
export declare enum ComponentEventType {
    BEFORE_SHOW = "beforeshow",
    SHOW = "show",
    HIDE = "hide",
    DISABLE = "disable",
    ENABLE = "enable",
    HIGHLIGHT = "highlight",
    UNHIGHLIGHT = "unhighlight",
    ACTIVATE = "activate",
    DEACTIVATE = "deactivate",
    SELECT = "select",
    UNSELECT = "unselect",
    CHECK = "check",
    UNCHECK = "uncheck",
    FOCUS = "focus",
    BLUR = "blur",
    OPEN = "open",
    CLOSE = "close",
    ENTER = "enter",
    LEAVE = "leave",
    ACTION = "action",
    CHANGE = "change"
}
/**
 * Base component class with lifecycle management and DOM manipulation
 */
export declare class Component extends EventTarget {
    protected element: Element | null;
    protected children: Component[];
    protected childIndex: Map<string, Component>;
    protected parent: Component | null;
    protected inDocument: boolean;
    protected wasDecorated: boolean;
    protected rightToLeft: boolean | null;
    protected pointerEventsEnabled: boolean;
    protected model: unknown;
    private readonly domHelper;
    private readonly idGenerator;
    private id;
    constructor(domHelper?: DomHelper);
    /**
     * Gets the unique ID for this component
     */
    getId(): string;
    /**
     * Sets the ID for this component
     */
    setId(id: string): void;
    /**
     * Creates the initial DOM representation for the component
     */
    protected createDom(): void;
    /**
     * Renders the component into the DOM
     */
    render(opt_parentElement?: Element): void;
    /**
     * Called when component's element is known to be in the document
     */
    protected enterDocument(): void;
    /**
     * Called when component's element is to be removed from the document
     */
    protected exitDocument(): void;
    /**
     * Disposes of the component
     */
    dispose(): void;
    getElement(): Element | null;
    isInDocument(): boolean;
    getParent(): Component | null;
    setParent(parent: Component | null): void;
}
//# sourceMappingURL=component.d.ts.map
