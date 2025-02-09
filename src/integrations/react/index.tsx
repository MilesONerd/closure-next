/**
 * @fileoverview React integration for Closure Next.
 * @license Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { Component, ComponentInterface, DOMHelper } from '@closure-next/core';

interface ClosureComponentState<T extends Component> {
  component: { new(domHelper?: DOMHelper): T };
  props?: Record<string, unknown>;
}

/**
 * React hook for using Closure Next components
 */
export function useClosureComponent<T extends Component>(
  ComponentClass: { new(domHelper?: DOMHelper): T },
  props?: Record<string, unknown>
): React.RefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null);
  const componentRef = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Create and initialize the Closure component
    const component = new ComponentClass();
    componentRef.current = component;
    
    // Store component instance on the ref element for access in tests
    (ref.current as any)._closureComponent = component;
    
    // Create DOM first to ensure element exists
    component.render(ref.current);
    
    // Apply props after rendering to ensure element exists
    if (props) {
      Object.entries(props).forEach(([key, value]) => {
        const setterName = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
        if (typeof (component as any)[setterName] === 'function') {
          (component as any)[setterName](value);
        } else {
          (component as any)[key] = value;
        }
      });
    }

    return () => {
      // Clean up on unmount
      if (ref.current) {
        delete (ref.current as any)._closureComponent;
      }
      component.dispose();
      componentRef.current = null;
    };
  }, [ComponentClass]);

  // Update props when they change
  useEffect(() => {
    const component = componentRef.current;
    if (!component || !props) return;

    Object.entries(props).forEach(([key, value]) => {
      const setterName = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
      if (typeof (component as any)[setterName] === 'function') {
        (component as any)[setterName](value);
      } else {
        (component as any)[key] = value;
      }
    });
  }, [props]);

  return ref as React.RefObject<HTMLDivElement>;
}

/**
 * React component wrapper for Closure Next components
 */
export function ClosureComponent<T extends Component>({
  component: ComponentClass,
  props
}: ClosureComponentState<T>): JSX.Element {
  const ref = useClosureComponent(ComponentClass, props);
  return <div ref={ref} data-testid="closure-component" />;
}
