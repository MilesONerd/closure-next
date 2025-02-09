/**
 * @fileoverview Component implementation for Closure Next.
 * @license Apache-2.0
 */
import { EventTarget, EventType } from './events';
export class Component extends EventTarget {
    constructor(domHelper) {
        super();
        this.domHelper = domHelper;
        this.element = null;
        this.id = '';
        this.parent = null;
        this.children = new Set();
        this.state = {};
    }
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
        if (this.element) {
            this.element.id = id;
            const parent = this.element.parentNode;
            if (parent) {
                parent.id = id;
            }
        }
    }
    getElement() {
        return this.element;
    }
    addChild(child) {
        this.children.add(child);
        child.parent = this;
    }
    removeChild(child) {
        this.children.delete(child);
        child.parent = null;
    }
    getParent() {
        return this.parent;
    }
    getChildren() {
        return Array.from(this.children);
    }
    getState() {
        return { ...this.state };
    }
    async setState(state) {
        const oldState = { ...this.state };
        this.state = { ...oldState, ...state };
        // Only emit and re-render if state actually changed
        if (JSON.stringify(oldState) !== JSON.stringify(this.state)) {
            // Emit state change event before rendering
            this.emit(EventType.STATECHANGE, { ...this.state });
            // Re-render if element exists and has a parent
            if (this.element && this.element.parentNode) {
                // Store current parent
                const parent = this.element.parentNode;
                // Re-create DOM with new state
                await this.createDom();
                // Re-render in parent
                await this.render(parent);
            }
        }
    }
    async createDom() {
        if (!this.element) {
            this.element = this.domHelper.createElement('div');
            if (this.id) {
                this.element.id = this.id;
            }
        }
    }
    async render(container) {
        if (!this.element) {
            await this.createDom();
        }
        if (container && this.element) {
            // Remove from old parent if needed
            if (this.element.parentNode && this.element.parentNode !== container) {
                this.element.parentNode.removeChild(this.element);
            }
            // Add to new parent if needed
            if (!this.element.parentNode) {
                container.appendChild(this.element);
            }
            // Update IDs
            if (this.id) {
                this.element.id = this.id;
                container.id = this.id;
            }
            // Render children
            const renderPromises = Array.from(this.children).map(child => child.render(this.element));
            await Promise.all(renderPromises);
            // Emit state change event after rendering
            this.emit(EventType.STATECHANGE, { ...this.state });
        }
    }
    async renderToString() {
        if (!this.element) {
            await this.createDom();
        }
        return this.element?.outerHTML || '';
    }
    async hydrate(container) {
        if (container) {
            const element = container.firstElementChild;
            if (element) {
                this.element = element;
            }
        }
        else if (this.id) {
            const element = this.domHelper.getElementById(this.id);
            if (element) {
                this.element = element;
            }
        }
    }
    dispose() {
        if (this.isDisposed()) {
            return;
        }
        this.children.forEach(child => child.dispose());
        this.children.clear();
        if (this.parent) {
            this.parent.removeChild(this);
        }
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
        this.emit(EventType.DISPOSE);
        super.dispose();
    }
}
//# sourceMappingURL=component.js.map