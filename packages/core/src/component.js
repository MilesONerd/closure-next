"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const events_1 = require("./events");
const types_1 = require("./types");
class Component extends events_1.EventTarget {
    constructor(domHelper) {
        super();
        this.domHelper = domHelper;
        this.stateFlags = types_1.ComponentStateFlags.NONE;
        this.element = null;
        this.children = [];
        this.childIndex = -1;
        this.parent = null;
        this.props = {};
        this.state = {};
    }
    getId() {
        return this.element?.id || '';
    }
    setId(id) {
        if (this.element) {
            this.element.id = id;
        }
    }
    getElement() {
        return this.element;
    }
    isInDocument() {
        return !!this.element && document.contains(this.element);
    }
    getParent() {
        return this.parent;
    }
    render(opt_parentElement) {
        if (!this.element) {
            this.createDom();
        }
        if (opt_parentElement && this.element) {
            opt_parentElement.appendChild(this.element);
        }
    }
    dispose() {
        this.exitDocument();
        this.element = null;
        this.children.forEach(child => child.dispose());
        this.children = [];
    }
    enterDocument() {
        this.children.forEach(child => child.enterDocument());
    }
    exitDocument() {
        this.children.forEach(child => child.exitDocument());
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
    addChild(child) {
        child.parent = this;
        child.childIndex = this.children.length;
        this.children.push(child);
    }
    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            child.exitDocument();
            child.parent = null;
            child.childIndex = -1;
            this.children.splice(index, 1);
        }
    }
    createDom() {
        // Override in subclasses
    }
    setState(state) {
        this.state = { ...this.state, ...state };
        if (this.isInDocument()) {
            this.exitDocument();
            this.enterDocument();
        }
    }
    getState() {
        return this.state;
    }
    setProps(props) {
        this.props = { ...this.props, ...props };
        if (this.isInDocument()) {
            this.exitDocument();
            this.enterDocument();
        }
    }
    getProps() {
        return this.props;
    }
}
exports.Component = Component;
//# sourceMappingURL=component.js.map