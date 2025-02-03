/**
 * @fileoverview Base component class for Closure Next.
 * Modernized version of the original Closure Library component.
 * @license Apache-2.0
 */

import { EventTarget } from './events';
import { DomHelper } from './dom';
import { IdGenerator } from './id';

/**
 * Component states that affect rendering and behavior
 */
export const ComponentState = {
  ALL: 0xFF,
  DISABLED: 0x01,
  HOVER: 0x02,
  ACTIVE: 0x04,
  SELECTED: 0x08,
  CHECKED: 0x10,
  FOCUSED: 0x20,
  OPENED: 0x40
} as const;

export type ComponentStateType = typeof ComponentState[keyof typeof ComponentState];

/**
 * Events dispatched by components
 */
export const ComponentEventType = {
  BEFORE_SHOW: 'beforeshow',
  SHOW: 'show',
  HIDE: 'hide',
  DISABLE: 'disable',
  ENABLE: 'enable',
  HIGHLIGHT: 'highlight',
  UNHIGHLIGHT: 'unhighlight',
  ACTIVATE: 'activate',
  DEACTIVATE: 'deactivate',
  SELECT: 'select',
  UNSELECT: 'unselect',
  CHECK: 'check',
  UNCHECK: 'uncheck',
  FOCUS: 'focus',
  BLUR: 'blur',
  OPEN: 'open',
  CLOSE: 'close',
  ENTER: 'enter',
  LEAVE: 'leave',
  ACTION: 'action',
  CHANGE: 'change'
} as const;

export type ComponentEventType = typeof ComponentEventType[keyof typeof ComponentEventType];

/**
 * Base component class with lifecycle management and DOM manipulation.
 * Provides core functionality for all UI components including:
 * - DOM creation and management
 * - Event handling
 * - Parent-child relationships
 * - Lifecycle management
 * @extends {EventTarget}
 */
export type ComponentConstructor<T extends Component> = new (domHelper: DomHelper) => T;

export interface ComponentInterface {
  getId(): string;
  setId(id: string): void;
  getElement(): HTMLElement | null;
  isInDocument(): boolean;
  getParent(): Component | null;
  render(opt_parentElement?: HTMLElement): void;
  dispose(): void;
  enterDocument(): void;
  exitDocument(): void;
  addChild(child: Component): void;
  removeChild(child: Component): void;
  addEventListener(type: string, listener: (this: unknown, evt: Event) => void): void;
  removeEventListener(type: string, listener: (this: unknown, evt: Event) => void): void;
  dispatchEvent(event: Event): boolean;
  /**
   * Creates the DOM element for this component.
   * @public
   */
  createDom(): void;
  
  /**
   * Called when component enters the document.
   * @public
   */
  enterDocument(): void;
  
  /**
   * Called when component exits the document.
   * @public
   */
  exitDocument(): void;
}

export class Component extends EventTarget implements ComponentInterface {
  // Protected properties
  protected element: HTMLElement | null = null;
  protected children: Component[] = [];
  protected childIndex: Map<string, Component> = new Map();
  protected parent: Component | null = null;
  protected inDocument = false;
  protected wasDecorated = false;
  protected rightToLeft: boolean | null = null;
  protected pointerEventsEnabled = false;
  protected model: unknown = null;

  protected readonly domHelper: DomHelper;
  protected readonly idGenerator: IdGenerator;
  protected readonly domEventHandlers: Map<string, (evt: Event) => void> = new Map();
  protected override readonly listeners: Map<string, Set<(evt: Event) => void>> = new Map();

  // Public properties
  public id = '';

  // Public API methods are implemented below
  // These are concrete implementations, not abstract declarations


  constructor(domHelper?: DomHelper) {
    super();
    this.domHelper = domHelper || new DomHelper(document);
    this.idGenerator = IdGenerator.getInstance();
  }

  /**
   * Gets the unique ID for this component.
   * @return The component's unique ID.
   * @public
   */
  public getId(): string {
    if (this.id === '') {
      this.id = this.idGenerator.getNextUniqueId();
    }
    return this.id;
  }

  /**
   * Sets the ID of this component.
   * @param id The new ID for the component.
   * @public
   */
  public setId(id: string): void {
    if (this.parent?.childIndex) {
      this.parent.childIndex.delete(this.id);
      this.parent.childIndex.set(id, this);
    }
    this.id = id;
  }

  /**
   * Creates the DOM element for this component.
   * @public
   */
  public createDom(): void {
    if (!this.element) {
      this.element = this.domHelper.createElement('div');
      
      // Set up event handlers for any existing listeners
      this.listeners.forEach((listeners, type) => {
        if (listeners.size > 0) {
          this.setupDomEventHandler(type);
        }
      });

      // Create DOM for children without attaching
      this.children.forEach(child => {
        if (!child.getElement()) {
          child.createDom();
        }
      });
    }
  }

  protected attachChildren(): void {
    if (!this.element) return;

    this.children.forEach(child => {
      const childElement = child.getElement();
      if (childElement && (!childElement.parentElement || childElement.parentElement !== this.element)) {
        this.domHelper.appendChild(this.element!, childElement);
      }
    });
  }

  protected setupDomEventHandler(type: string): void {
    if (!this.element) return;

    // Remove existing handler if any
    const existingHandler = this.domEventHandlers.get(type);
    if (existingHandler) {
      this.domHelper.removeEventListener(this.element, type, existingHandler, true);
      this.domEventHandlers.delete(type);
    }

    // Create new handler that calls all listeners
    const domHandler = (evt: Event) => {
      // Stop propagation to prevent duplicate handling
      evt.stopPropagation();

      // Call component listeners
      const listeners = this.listeners.get(type);
      if (listeners) {
        // Convert Set to Array to avoid modification during iteration
        const listenerArray = Array.from(listeners);
        for (const listener of listenerArray) {
          try {
            // Create a new event of the same type as the original
            const listenerEvent = evt instanceof CustomEvent ?
              new CustomEvent(evt.type, {
                bubbles: evt.bubbles,
                cancelable: evt.cancelable,
                detail: evt.detail
              }) :
              new Event(evt.type, {
                bubbles: evt.bubbles,
                cancelable: evt.cancelable
              });

            // Mark as DOM-originated to prevent infinite loops
            Object.defineProperty(listenerEvent, '_fromDom', {
              value: true,
              configurable: true
            });

            // Copy standard event properties
            if (evt.defaultPrevented) {
              listenerEvent.preventDefault();
            }
            if (evt.cancelBubble) {
              listenerEvent.stopPropagation();
            }

            // Copy target and currentTarget
            Object.defineProperty(listenerEvent, 'target', {
              value: this.element,
              configurable: true
            });
            Object.defineProperty(listenerEvent, 'currentTarget', {
              value: this.element,
              configurable: true
            });
            
            listener.call(this, listenerEvent);
          } catch (e) {
            console.error('Error in event handler:', e);
          }
        }
      }
    };

    // Add the new handler in capture phase
    this.domEventHandlers.set(type, domHandler);
    this.domHelper.addEventListener(this.element, type, domHandler, true);
  }

  /**
   * Renders the component into the DOM.
   * @param opt_parentElement Optional parent element to render into.
   * @throws {Error} If the component is already rendered.
   * @public
   */
  public render(opt_parentElement?: HTMLElement): void {
    // Create DOM if needed
    if (!this.element) {
      this.createDom();
    }

    // Ensure element exists
    if (!this.element) {
      throw new Error('Failed to create DOM element');
    }

    // If already in document, just move to new parent
    if (this.inDocument) {
      if (this.element.parentElement) {
        this.domHelper.removeNode(this.element);
      }
      const parent = (opt_parentElement || document.body) as HTMLElement;
      this.domHelper.appendChild(parent, this.element);
      return;
    }

    // Set up DOM event handlers for all existing listeners
    this.listeners.forEach((listeners, type) => {
      if (listeners.size > 0 && !this.domEventHandlers.has(type)) {
        this.setupDomEventHandler(type);
      }
    });

    // Add to DOM
    const parent = (opt_parentElement || document.body) as HTMLElement;
    this.domHelper.appendChild(parent, this.element);

    // Mark as in document before handling children
    this.inDocument = true;

    // Attach children
    this.attachChildren();

    // Enter document for children
    this.children.forEach(child => {
      if (!child.isInDocument()) {
        child.enterDocument();
      }
    });
  }

  private ensureInDocument(): void {
    if (!this.parent?.element || !this.parent.inDocument) {
      return;
    }

    // Create our DOM if needed
    if (!this.element) {
      this.createDom();
    }

    // Attach to parent's element if we have one
    if (this.element) {
      if (!this.element.parentElement || this.element.parentElement !== this.parent.element) {
        this.parent.domHelper.appendChild(this.parent.element, this.element);
      }
      this.inDocument = true;
      this.enterDocument();
    }
  }

  protected setParent(parent: Component | null): void {
    if (parent === this) {
      throw new Error('Cannot set parent to self');
    }

    // Remove from old parent first
    if (this.parent && this.parent !== parent) {
      const index = this.parent.children.indexOf(this);
      if (index !== -1) {
        this.parent.children.splice(index, 1);
      }
      if (this.id) {
        this.parent.childIndex.delete(this.id);
      }
    }

    // Update parent reference
    const oldParent = this.parent;
    this.parent = parent;

    // Add to new parent's data structures
    if (parent && !parent.children.includes(this)) {
      parent.children.push(this);
      if (this.id) {
        parent.childIndex.set(this.id, this);
      }

      // Create parent's DOM if needed
      if (!parent.element) {
        parent.createDom();
      }

      // Create our DOM if needed
      if (!this.element) {
        this.createDom();
      }

      // Ensure elements exist after creation
      if (!parent.element || !this.element) {
        throw new Error('Failed to create DOM elements');
      }

      // Attach to parent's element
      const elementParent = this.element.parentElement;
      if (!elementParent || elementParent !== parent.element) {
        parent.domHelper.appendChild(parent.element, this.element);
      }

      // If parent is in document, enter document
      if (parent.inDocument) {
        this.inDocument = true;
        this.enterDocument();

        // Now handle children recursively
        this.children.forEach(child => {
          // Create child DOM if needed
          if (!child.getElement()) {
            child.createDom();
          }

          const childElement = child.getElement();
          if (childElement && this.element) {
            const childParent = childElement.parentElement;
            if (!childParent || childParent !== this.element) {
              this.domHelper.appendChild(this.element, childElement);
            }

            // Mark child as in document and enter
            child.inDocument = true;
            child.enterDocument();
          }
        });
      }
    }

    // If we're detaching (parent is null)
    if (!parent) {
      // First detach all children
      this.children.forEach(child => {
        child.setParent(null);
      });

      // Reset our state
      if (this.element) {
        if (this.element.parentElement) {
          this.domHelper.removeNode(this.element);
        }
        this.element = null;
      }
      this.inDocument = false;
      this.wasDecorated = false;
      this.rightToLeft = null;
      this.pointerEventsEnabled = false;
      this.model = null;
    }
  }

  public override dispose(): void {
    // First exit document if needed
    if (this.inDocument) {
      this.exitDocument();
    }

    // Store references we need for cleanup
    const elementRef = this.element;
    const childrenToDispose = [...this.children];
    const parentRef = this.parent;

    // Clean up DOM event handlers first
    if (elementRef) {
      this.domEventHandlers.forEach((handler, type) => {
        this.domHelper.removeEventListener(elementRef, type, handler, true);
      });
      this.domEventHandlers.clear();

      // Remove from DOM if not decorated
      if (!this.wasDecorated && elementRef.parentElement) {
        elementRef.parentElement.removeChild(elementRef);
      }
    }

    // Clear component event listeners
    this.listeners.forEach((listeners, type) => {
      listeners.clear();
    });
    this.listeners.clear();

    // First dispose children (before clearing our own state)
    childrenToDispose.forEach(child => {
      // Ensure child knows it's detached before disposal
      if (child.parent === this) {
        child.setParent(null);  // Use setParent to properly detach
      }
      child.dispose();
    });

    // Remove from parent's data structures if we have a parent
    if (parentRef) {
      const index = parentRef.children.indexOf(this);
      if (index !== -1) {
        parentRef.children.splice(index, 1);
      }
      parentRef.childIndex.delete(this.id);
    }

    // Finally clear own state
    this.element = null;
    this.children = [];
    this.childIndex.clear();
    this.parent = null;
    this.model = null;
    this.inDocument = false;
    this.wasDecorated = false;
    this.rightToLeft = null;
    this.pointerEventsEnabled = false;
    this.id = '';
  }

  /**
   * Called when component enters the document.
   * @public
   */
  public enterDocument(): void {
    // Create DOM if needed
    if (!this.element) {
      this.createDom();
    }

    if (!this.element) {
      throw new Error('Failed to create DOM element');
    }

    // Mark as in document
    this.inDocument = true;

    // Enter document for children
    this.children.forEach(child => {
      // Create child DOM if needed
      if (!child.getElement()) {
        child.createDom();
      }

      const childElement = child.getElement();
      if (childElement) {
        // If child element exists but isn't attached to parent, attach it
        if (!childElement.parentElement && this.element) {
          this.domHelper.appendChild(this.element, childElement);
        }

        // Mark child as in document and recursively enter document
        // Note: We check parent element to ensure proper attachment
        if (childElement.parentElement === this.element) {
          child.inDocument = true;
          child.enterDocument();
        }
      }
    });
  }

  /**
   * Adds an event listener to the component.
   * @param type The event type to listen for.
   * @param listener The event handler function.
   * @public
   */
  public override addEventListener(type: string, listener: (this: unknown, evt: Event) => void): void {
    // Add listener to the map
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
      
      // Set up DOM handler if element exists and this is the first listener
      if (this.element) {
        this.setupDomEventHandler(type);
      }
    }
    
    // Add the listener to the set
    this.listeners.get(type)!.add(listener);
  }

  /**
   * Removes an event listener from the component.
   * @param type The event type to stop listening for.
   * @param listener The event handler function to remove.
   * @public
   */
  public override removeEventListener(type: string, listener: (this: unknown, evt: Event) => void): void {
    const listeners = this.listeners.get(type);
    if (listeners) {
      listeners.delete(listener);
      
      // If no more listeners for this type, remove the DOM handler
      if (listeners.size === 0) {
        this.listeners.delete(type);
        if (this.element) {
          const handler = this.domEventHandlers.get(type);
          if (handler) {
            this.domHelper.removeEventListener(this.element, type, handler, true);
            this.domEventHandlers.delete(type);
          }
        }
      }
    }
  }

  /**
   * Dispatches an event on this component.
   * @param event The event to dispatch.
   * @return Whether the event's default action was prevented.
   * @public
   */
  public override dispatchEvent(event: Event): boolean {
    // Handle both component and DOM events
    const typeListeners = this.listeners.get(event.type);
    let defaultPrevented = event.defaultPrevented;

    // Call component listeners
    if (typeListeners) {
      // Convert Set to Array to avoid modification during iteration
      const listeners = Array.from(typeListeners);
      for (const listener of listeners) {
        try {
          // Create a new event for each listener to prevent modification
          const listenerEvent = event instanceof CustomEvent ?
            new CustomEvent(event.type, {
              bubbles: event.bubbles,
              cancelable: event.cancelable,
              detail: event.detail
            }) :
            new Event(event.type, {
              bubbles: event.bubbles,
              cancelable: event.cancelable
            });
          
          // Copy standard event properties that are writable
          listenerEvent.cancelBubble = event.cancelBubble;
          listenerEvent.returnValue = event.returnValue;
          if (event.defaultPrevented) {
            listenerEvent.preventDefault();
          }
          if (event.cancelBubble) {
            listenerEvent.stopPropagation();
          }
          
          listener.call(this, listenerEvent);
          if (listenerEvent.defaultPrevented) {
            defaultPrevented = true;
          }
        } catch (e) {
          console.error('Error in event handler:', e);
        }
      }
    }


    // If we have a DOM element and this is not a DOM-originated event
    if (this.element && !(event as any)._fromDom) {
      try {
        // Create a new event of the same type as the original
        const domEvent = event instanceof CustomEvent ?
          new CustomEvent(event.type, {
            bubbles: event.bubbles,
            cancelable: event.cancelable,
            detail: event.detail
          }) :
          new Event(event.type, {
            bubbles: event.bubbles,
            cancelable: event.cancelable
          });

        // Mark as DOM-originated to prevent infinite loops
        Object.defineProperty(domEvent, '_fromDom', {
          value: true,
          configurable: true
        });

        // Copy standard event properties
        if (event.defaultPrevented) {
          domEvent.preventDefault();
        }
        if (event.cancelBubble) {
          domEvent.stopPropagation();
        }

        // Copy target and currentTarget
        Object.defineProperty(domEvent, 'target', {
          value: this.element,
          configurable: true
        });
        Object.defineProperty(domEvent, 'currentTarget', {
          value: this.element,
          configurable: true
        });

        // Dispatch to DOM
        this.element.dispatchEvent(domEvent);
      } catch (e) {
        console.error('Error dispatching DOM event:', e);
      }
    }

    return !defaultPrevented;
  }

  /**
   * Called when component exits the document.
   * @public
   */
  public exitDocument(): void {
    this.children.forEach(child => {
      if (child.isInDocument()) {
        child.exitDocument();
      }
    });
    this.inDocument = false;
  }

  /**
   * Adds the specified component as a child of this component.
   * @param child The new child component.
   * @throws {Error} If the child element cannot be created.
   * @public
   */
  public addChild(child: Component): void {
    if (child.parent === this) {
      return;
    }

    // Remove from old parent
    if (child.parent) {
      child.parent.removeChild(child);
    }

    // Add to our data structures
    this.children.push(child);
    
    // Create our DOM if needed
    if (!this.element) {
      this.createDom();
    }

    // Set parent relationship first
    child.setParent(this);
    
    // Create child DOM if needed
    if (!child.getElement()) {
      child.createDom();
    }

    // Ensure child element exists
    if (!child.getElement()) {
      throw new Error('Failed to create child DOM element');
    }
    
    if (child.id) {
      this.childIndex.set(child.id, child);
    }

    // If we're in document, ensure child is properly initialized and attached
    if (this.inDocument && this.element) {
      const childElement = child.getElement();
      if (childElement && (!childElement.parentElement || childElement.parentElement !== this.element)) {
        this.domHelper.appendChild(this.element, childElement);
      }
      child.inDocument = true;
      child.enterDocument();
    }
  }

  /**
   * Removes the specified child component from this component.
   * @param child The child component to remove.
   * @public
   */
  public removeChild(child: Component): void {
    if (child.parent !== this) {
      return;
    }

    // Exit document first if needed
    if (child.isInDocument()) {
      child.exitDocument();
    }

    // Remove from children array
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
    }

    // Remove from child index
    if (child.id) {
      this.childIndex.delete(child.id);
    }

    // Clear parent reference only - disposal is handled separately
    child.parent = null;
  }

  /**
   * Gets the DOM element associated with this component.
   * @return The component's element or null if not created.
   * @public
   */
  public getElement(): HTMLElement | null {
    return this.element;
  }

  /**
   * Returns whether the component is in the document.
   * @return True if the component is in the document.
   * @public
   */
  public isInDocument(): boolean {
    return this.inDocument;
  }

  /**
   * Gets the parent component.
   * @return The parent component or null if none.
   * @public
   */
  public getParent(): Component | null {
    return this.parent;
  }
}
