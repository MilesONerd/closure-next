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
export var ComponentState;
(function (ComponentState) {
    ComponentState[ComponentState["ALL"] = 255] = "ALL";
    ComponentState[ComponentState["DISABLED"] = 1] = "DISABLED";
    ComponentState[ComponentState["HOVER"] = 2] = "HOVER";
    ComponentState[ComponentState["ACTIVE"] = 4] = "ACTIVE";
    ComponentState[ComponentState["SELECTED"] = 8] = "SELECTED";
    ComponentState[ComponentState["CHECKED"] = 16] = "CHECKED";
    ComponentState[ComponentState["FOCUSED"] = 32] = "FOCUSED";
    ComponentState[ComponentState["OPENED"] = 64] = "OPENED";
})(ComponentState || (ComponentState = {}));
/**
 * Events dispatched by components
 */
export var ComponentEventType;
(function (ComponentEventType) {
    ComponentEventType["BEFORE_SHOW"] = "beforeshow";
    ComponentEventType["SHOW"] = "show";
    ComponentEventType["HIDE"] = "hide";
    ComponentEventType["DISABLE"] = "disable";
    ComponentEventType["ENABLE"] = "enable";
    ComponentEventType["HIGHLIGHT"] = "highlight";
    ComponentEventType["UNHIGHLIGHT"] = "unhighlight";
    ComponentEventType["ACTIVATE"] = "activate";
    ComponentEventType["DEACTIVATE"] = "deactivate";
    ComponentEventType["SELECT"] = "select";
    ComponentEventType["UNSELECT"] = "unselect";
    ComponentEventType["CHECK"] = "check";
    ComponentEventType["UNCHECK"] = "uncheck";
    ComponentEventType["FOCUS"] = "focus";
    ComponentEventType["BLUR"] = "blur";
    ComponentEventType["OPEN"] = "open";
    ComponentEventType["CLOSE"] = "close";
    ComponentEventType["ENTER"] = "enter";
    ComponentEventType["LEAVE"] = "leave";
    ComponentEventType["ACTION"] = "action";
    ComponentEventType["CHANGE"] = "change";
})(ComponentEventType || (ComponentEventType = {}));
/**
 * Base component class with lifecycle management and DOM manipulation
 */
export class Component extends EventTarget {
    constructor(domHelper) {
        super();
        this.element = null;
        this.children = [];
        this.childIndex = new Map();
        this.parent = null;
        this.inDocument = false;
        this.wasDecorated = false;
        this.rightToLeft = null;
        this.pointerEventsEnabled = false;
        this.model = null;
        this.id = '';
        this.domHelper = domHelper || new DomHelper();
        this.idGenerator = IdGenerator.getInstance();
    }
    /**
     * Gets the unique ID for this component
     */
    getId() {
        if (this.id === '') {
            this.id = this.idGenerator.getNextUniqueId();
        }
        return this.id;
    }
    /**
     * Sets the ID for this component
     */
    setId(id) {
        if (this.parent?.childIndex) {
            this.parent.childIndex.delete(this.id);
            this.parent.childIndex.set(id, this);
        }
        this.id = id;
    }
    /**
     * Creates the initial DOM representation for the component
     */
    createDom() {
        this.element = this.domHelper.createElement('div');
    }
    /**
     * Renders the component into the DOM
     */
    render(opt_parentElement) {
        if (this.inDocument) {
            throw new Error('Component already rendered');
        }
        if (!this.element) {
            this.createDom();
        }
        if (opt_parentElement) {
            opt_parentElement.appendChild(this.element);
        }
        else {
            document.body.appendChild(this.element);
        }
        if (!this.parent || this.parent.isInDocument()) {
            this.enterDocument();
        }
    }
    /**
     * Called when component's element is known to be in the document
     */
    enterDocument() {
        this.inDocument = true;
        this.children.forEach(child => {
            if (!child.isInDocument() && child.getElement()) {
                child.enterDocument();
            }
        });
    }
    /**
     * Called when component's element is to be removed from the document
     */
    exitDocument() {
        this.children.forEach(child => {
            if (child.isInDocument()) {
                child.exitDocument();
            }
        });
        this.inDocument = false;
    }
    /**
     * Disposes of the component
     */
    dispose() {
        if (this.inDocument) {
            this.exitDocument();
        }
        this.children.forEach(child => child.dispose());
        if (!this.wasDecorated && this.element) {
            this.element.remove();
        }
        this.children = [];
        this.childIndex.clear();
        this.element = null;
        this.model = null;
        this.parent = null;
        super.dispose();
    }
    // Getters/setters and utility methods
    getElement() {
        return this.element;
    }
    isInDocument() {
        return this.inDocument;
    }
    getParent() {
        return this.parent;
    }
    setParent(parent) {
        if (parent === this) {
            throw new Error('Cannot set parent to self');
        }
        this.parent = parent;
    }
}
//# sourceMappingURL=component.js.map
