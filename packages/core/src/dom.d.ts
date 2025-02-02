/**
 * @fileoverview DOM helper utilities for Closure Next.
 * @license Apache-2.0
 */
/**
 * Helper class for DOM manipulation
 */
export declare class DomHelper {
    private readonly document;
    constructor(opt_document?: Document);
    /**
     * Creates an element
     */
    createElement(tagName: string): HTMLElement;
    /**
     * Gets an element by ID
     */
    getElement(id: string): HTMLElement | null;
    /**
     * Gets elements by class name
     */
    getElementsByClass(className: string, opt_element?: HTMLElement): HTMLElement[];
    /**
     * Gets the first element with the given class name
     */
    getElementByClass(className: string, opt_element?: HTMLElement): HTMLElement | null;
    /**
     * Removes an element from its parent
     */
    removeNode(element: HTMLElement): void;
    /**
     * Appends a child element
     */
    appendChild(parent: HTMLElement, child: HTMLElement): void;
    /**
     * Adds an event listener to an element
     */
    addEventListener(element: HTMLElement, type: string, listener: (evt: Event) => void, useCapture?: boolean): void;
    /**
     * Removes an event listener from an element
     */
    removeEventListener(element: HTMLElement, type: string, listener: (evt: Event) => void, useCapture?: boolean): void;
    /**
     * Returns the document object being used
     */
    getDocument(): Document;
}
//# sourceMappingURL=dom.d.ts.map