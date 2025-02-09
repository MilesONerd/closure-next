/**
 * @fileoverview DOM helper implementation for Closure Next.
 * @license Apache-2.0
 */
export declare class DOMHelper {
    private document;
    constructor(document?: Document);
    createElement(tagName: string): HTMLElement;
    createTextNode(text: string): Text;
    getElementById(id: string): Element | null;
    getElementsByTagName(tagName: string): HTMLCollectionOf<Element>;
    getElementsByClassName(className: string): HTMLCollectionOf<Element>;
    querySelector(selector: string): Element | null;
    querySelectorAll(selector: string): NodeListOf<Element>;
    setAttribute(element: Element, name: string, value: string): void;
    getAttribute(element: Element, name: string): string | null;
    removeAttribute(element: Element, name: string): void;
    appendChild(parent: Node, child: Node): void;
    removeChild(parent: Node, child: Node): void;
    insertBefore(parent: Node, newNode: Node, referenceNode: Node | null): void;
    replaceChild(parent: Node, newChild: Node, oldChild: Node): void;
}
//# sourceMappingURL=dom.d.ts.map