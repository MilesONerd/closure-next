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
    createElement(tagName: string): Element;
    /**
     * Gets an element by ID
     */
    getElement(id: string): Element | null;
    /**
     * Gets elements by class name
     */
    getElementsByClass(className: string, opt_element?: Element): Element[];
    /**
     * Gets the first element with the given class name
     */
    getElementByClass(className: string, opt_element?: Element): Element | null;
    /**
     * Returns the document object being used
     */
    getDocument(): Document;
}
//# sourceMappingURL=dom.d.ts.map
