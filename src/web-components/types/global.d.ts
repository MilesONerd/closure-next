// Extend global interfaces
declare global {
  interface Window {
    readonly customElements: CustomElementRegistry;
  }
  
  // Extend Jest matchers
  namespace jest {
    interface Matchers<R> {
      toHaveAttribute(attr: string, value: string): R;
      toBeInstanceOf(expected: any): R;
      toBeTruthy(): R;
    }
  }

  // Extend HTMLElement
  interface HTMLElement {
    connectedCallback?(): void;
    disconnectedCallback?(): void;
    attributeChangedCallback?(name: string, oldValue: string | null, newValue: string | null): void;
    adoptedCallback?(): void;
  }

  // Extend Document
  interface Document {
    createElement(tagName: string, options?: ElementCreationOptions): HTMLElement;
  }

  // Add HTMLTemplateElement
  interface HTMLTemplateElement extends HTMLElement {
    readonly content: DocumentFragment;
  }
}

export {};
