/**
 * @fileoverview Svelte integration for Closure Next.
 * @license Apache-2.0
 */

import type { Component } from '@closure-next/core';
import { SvelteComponent, type ComponentType } from 'svelte';

interface ClosureComponentOptions<T extends Component> {
  target: HTMLElement;
  props?: Record<string, unknown>;
  component: new () => T;
}

/**
 * Creates a Svelte-compatible wrapper for a Closure Next component
 */
export function closureComponent<T extends Component>(
  options: ClosureComponentOptions<T>
): SvelteComponent {
  const { target, props = {}, component: ComponentClass } = options;
  
  // Create the Closure component instance
  const closureInstance = new ComponentClass();
  
  // Create a Svelte component wrapper
  const wrapper = new class extends SvelteComponent {
    constructor(options: { target: HTMLElement; props?: Record<string, unknown> }) {
      super(options);
      
      // Initialize the Closure component
      closureInstance.render(target);
      
      // Store reference to Closure component
      Object.defineProperty(target, '_closureComponent', {
        value: closureInstance,
        configurable: true,
        enumerable: false
      });
      
      // Set up reactive props
      if (props) {
        Object.entries(props).forEach(([key, value]) => {
          // Try to find a setter method first
          const setterName = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
          const setter = (closureInstance as any)[setterName];
          
          if (typeof setter === 'function') {
            // Use setter if available
            setter.call(closureInstance, value);
          } else {
            // Fall back to direct property assignment
            const propKey = key as keyof T;
            if (typeof (closureInstance as any)[propKey] === 'function') {
              (closureInstance as any)[propKey](value);
            } else {
              (closureInstance as any)[propKey] = value;
            }
          }
        });
      }
    }
    
    $destroy() {
      // Clean up the Closure component
      closureInstance.dispose();
      
      // Clean up component reference
      if (Object.prototype.hasOwnProperty.call(target, '_closureComponent')) {
        delete (target as any)._closureComponent;
      }
      
      super.$destroy();
    }
  }({ target, props });

  return wrapper;
}
