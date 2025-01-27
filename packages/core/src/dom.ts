/**
 * @fileoverview DOM helper utilities for Closure Next.
 * @license Apache-2.0
 */

/**
 * Helper class for DOM manipulation
 */
export class DomHelper {
  private readonly document: Document;

  constructor(opt_document?: Document) {
    this.document = opt_document || document;
  }

  /**
   * Creates an element
   */
  createElement(tagName: string): HTMLElement {
    return this.document.createElement(tagName);
  }

  /**
   * Gets an element by ID
   */
  getElement(id: string): HTMLElement | null {
    return this.document.getElementById(id);
  }

  /**
   * Gets elements by class name
   */
  getElementsByClass(className: string, opt_element?: HTMLElement): HTMLElement[] {
    const root = opt_element || this.document;
    return Array.from(root.getElementsByClassName(className)) as HTMLElement[];
  }

  /**
   * Gets the first element with the given class name
   */
  getElementByClass(className: string, opt_element?: HTMLElement): HTMLElement | null {
    const elements = this.getElementsByClass(className, opt_element);
    return elements[0] || null;
  }

  /**
   * Removes an element from its parent
   */
  removeNode(element: HTMLElement): void {
    const parent = element.parentElement;
    if (parent) {
      parent.removeChild(element);
    }
  }

  /**
   * Appends a child element
   */
  appendChild(parent: HTMLElement, child: HTMLElement): void {
    parent.appendChild(child);
  }

  /**
   * Adds an event listener to an element
   */
  addEventListener(element: HTMLElement, type: string, listener: (evt: Event) => void, useCapture = false): void {
    element.addEventListener(type, listener, useCapture);
  }

  /**
   * Removes an event listener from an element
   */
  removeEventListener(element: HTMLElement, type: string, listener: (evt: Event) => void, useCapture = false): void {
    element.removeEventListener(type, listener, useCapture);
  }

  /**
   * Returns the document object being used
   */
  getDocument(): Document {
    return this.document;
  }
}
