/**
 * @fileoverview DOM helper utilities for Closure Next.
 * @license Apache-2.0
 */
/**
 * Helper class for DOM manipulation
 */
export class DomHelper {
    constructor(opt_document) {
        this.document = opt_document || document;
    }
    /**
     * Creates an element
     */
    createElement(tagName) {
        return this.document.createElement(tagName);
    }
    /**
     * Gets an element by ID
     */
    getElement(id) {
        return this.document.getElementById(id);
    }
    /**
     * Gets elements by class name
     */
    getElementsByClass(className, opt_element) {
        const root = opt_element || this.document;
        return Array.from(root.getElementsByClassName(className));
    }
    /**
     * Gets the first element with the given class name
     */
    getElementByClass(className, opt_element) {
        const elements = this.getElementsByClass(className, opt_element);
        return elements[0] || null;
    }
    /**
     * Removes an element from its parent
     */
    removeNode(element) {
        const parent = element.parentElement;
        if (parent) {
            parent.removeChild(element);
        }
    }
    /**
     * Appends a child element
     */
    appendChild(parent, child) {
        parent.appendChild(child);
    }
    /**
     * Adds an event listener to an element
     */
    addEventListener(element, type, listener, useCapture = false) {
        element.addEventListener(type, listener, useCapture);
    }
    /**
     * Removes an event listener from an element
     */
    removeEventListener(element, type, listener, useCapture = false) {
        element.removeEventListener(type, listener, useCapture);
    }
    /**
     * Returns the document object being used
     */
    getDocument() {
        return this.document;
    }
}
//# sourceMappingURL=dom.js.map