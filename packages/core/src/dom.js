/**
 * @fileoverview DOM helper implementation for Closure Next.
 * @license Apache-2.0
 */
export class DOMHelper {
    constructor(document) {
        if (!document) {
            if (typeof window === 'undefined' || !window.document) {
                throw new Error('DOMHelper requires a document instance when window.document is not available');
            }
            this.document = window.document;
        }
        else {
            this.document = document;
        }
    }
    createElement(tagName) {
        if (!this.document) {
            throw new Error('DOMHelper document not initialized');
        }
        try {
            return this.document.createElement(tagName);
        }
        catch (error) {
            throw new Error(`Failed to create element with tag ${tagName}: ${error}`);
        }
    }
    createTextNode(text) {
        return this.document.createTextNode(text);
    }
    getElementById(id) {
        return this.document.getElementById(id);
    }
    getElementsByTagName(tagName) {
        return this.document.getElementsByTagName(tagName);
    }
    getElementsByClassName(className) {
        return this.document.getElementsByClassName(className);
    }
    querySelector(selector) {
        return this.document.querySelector(selector);
    }
    querySelectorAll(selector) {
        return this.document.querySelectorAll(selector);
    }
    setAttribute(element, name, value) {
        element.setAttribute(name, value);
    }
    getAttribute(element, name) {
        return element.getAttribute(name);
    }
    removeAttribute(element, name) {
        element.removeAttribute(name);
    }
    appendChild(parent, child) {
        parent.appendChild(child);
    }
    removeChild(parent, child) {
        parent.removeChild(child);
    }
    insertBefore(parent, newNode, referenceNode) {
        parent.insertBefore(newNode, referenceNode);
    }
    replaceChild(parent, newChild, oldChild) {
        parent.replaceChild(newChild, oldChild);
    }
}
//# sourceMappingURL=dom.js.map