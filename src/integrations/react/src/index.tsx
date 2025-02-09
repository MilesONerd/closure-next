import { Component, DOMHelper, type ComponentState } from "@closure-next/core/dist/index.js";
import React from "react";
import type { ClosureComponentState, UseClosureComponentReturn, ClosureInstance } from './types';

export function useClosureComponent<T extends Component>(
  ComponentClass: new (domHelper?: DOMHelper) => T
): UseClosureComponentReturn<T> {
  const componentRef = React.useRef<ClosureInstance<T> | null>(null);
  const elementRef = React.useRef<HTMLDivElement | null>(null);

  const setProps = React.useCallback((props: Partial<ComponentState>) => {
    if (componentRef.current) {
      Object.entries(props).forEach(([key, value]) => {
        const method = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
        if (typeof componentRef.current![method as keyof T] === 'function') {
          (componentRef.current![method as keyof T] as Function)(value);
        }
      });

      // Re-render if component is already in document
      if (componentRef.current.isInDocument()) {
        componentRef.current.exitDocument();
        componentRef.current.enterDocument();
      }
    }
  }, []);

  React.useEffect(() => {
    if (elementRef.current && !componentRef.current) {
      try {
        const component = new ComponentClass(new DOMHelper(document));
        componentRef.current = component as ClosureInstance<T>;
        
        component.enterDocument();
        const componentElement = component.getElement();
        if (componentElement) {
          elementRef.current.appendChild(componentElement);
        }
      } catch (error) {
        console.error('Error rendering Closure component:', error);
      }
    }
    return () => {
      if (componentRef.current) {
        try {
          componentRef.current.exitDocument();
          componentRef.current.dispose();
          componentRef.current = null;
        } catch (error) {
          console.error('Error cleaning up component:', error);
        }
      }
    };
  }, [ComponentClass]);

  return {
    ref: elementRef,
    component: componentRef as React.MutableRefObject<T | null>,
    setProps
  };
}

export { ClosureComponent } from './ClosureComponent';
export type { ClosureComponentState, UseClosureComponentReturn, ClosureInstance } from './types';
