/**
 * @fileoverview DOM helper implementation for Closure Next.
 * @license Apache-2.0
 */

export class DOMHelper {
  private document: Document;

  constructor(document?: Document) {
    if (!document) {
      if (typeof window === 'undefined' || !window.document) {
        throw new Error('DOMHelper requires a document instance when window.document is not available');
      }
      this.document = window.document;
    } else {
      this.document = document;
    }
  }

  createElement(tagName: string): HTMLElement {
    if (!this.document) {
      throw new Error('DOMHelper document not initialized');
    }
    try {
      return this.document.createElement(tagName);
    } catch (error) {
      throw new Error(`Failed to create element with tag ${tagName}: ${error}`);
    }
  }

  createTextNode(text: string): Text {
    return this.document.createTextNode(text);
  }

  getElementById(id: string): Element | null {
    return this.document.getElementById(id);
  }

  getElementsByTagName(tagName: string): HTMLCollectionOf<Element> {
    return this.document.getElementsByTagName(tagName);
  }

  getElementsByClassName(className: string): HTMLCollectionOf<Element> {
    return this.document.getElementsByClassName(className);
  }

  querySelector(selector: string): Element | null {
    return this.document.querySelector(selector);
  }

  querySelectorAll(selector: string): NodeListOf<Element> {
    return this.document.querySelectorAll(selector);
  }

  setAttribute(element: Element, name: string, value: string): void {
    element.setAttribute(name, value);
  }

  getAttribute(element: Element, name: string): string | null {
    return element.getAttribute(name);
  }

  removeAttribute(element: Element, name: string): void {
    element.removeAttribute(name);
  }

  appendChild(parent: Node, child: Node): void {
    parent.appendChild(child);
  }

  removeChild(parent: Node, child: Node): void {
    parent.removeChild(child);
  }

  insertBefore(parent: Node, newNode: Node, referenceNode: Node | null): void {
    parent.insertBefore(newNode, referenceNode);
  }

  replaceChild(parent: Node, newChild: Node, oldChild: Node): void {
    parent.replaceChild(newChild, oldChild);
  }
}
