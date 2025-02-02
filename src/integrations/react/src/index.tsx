import { Component, DomHelper, type ComponentInterface } from "@closure-next/core/dist/index.js";
import React from "react";

export interface ClosureComponentProps {
  component: new (domHelper?: DomHelper) => ComponentInterface;
  props?: Record<string, unknown>;
  errorBoundary?: boolean;
  fallback?: React.ReactNode;
}

export function useClosureComponent(Component: new (domHelper?: DomHelper) => ComponentInterface): React.RefCallback<HTMLDivElement> {
  const componentRef = React.useRef<ComponentInterface | null>(null);
  const elementRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (elementRef.current && !componentRef.current) {
      try {
        const component = new Component(new DomHelper(document));
        componentRef.current = component;
        
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
          console.error('Error cleaning up previous component:', error);
        }
      }
    };
  }, [Component]);

  const renderCallback = React.useCallback((element: HTMLDivElement | null) => {
    if (componentRef.current) {
      try {
        componentRef.current.exitDocument();
        componentRef.current.dispose();
      } catch (error) {
        console.error('Error cleaning up previous component:', error);
      }
      componentRef.current = null;
    }

    elementRef.current = element;
    if (element) {
      element.setAttribute('data-testid', 'hook-wrapper');
      try {
        const component = new Component(new DomHelper(document));
        componentRef.current = component;
        
        component.enterDocument();
        const componentElement = component.getElement();
        if (componentElement) {
          element.appendChild(componentElement);
        }
      } catch (error) {
        console.error('Error rendering Closure component:', error);
      }
    }
  }, [Component]);

  return renderCallback;
}

export { Component, type ComponentInterface };
export { ClosureComponent } from './ClosureComponent.js';
