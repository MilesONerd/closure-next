import { Component, type ComponentInterface } from "@closure-next/core";
import React from "react";

export interface ClosureComponentProps {
  component: ComponentInterface;
  props?: Record<string, unknown>;
  errorBoundary?: boolean;
  fallback?: React.ReactNode;
}

export function useClosureComponent(component: ComponentInterface): React.RefCallback<HTMLDivElement> {
  const componentRef = React.useRef<ComponentInterface>(component);
  const elementRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    componentRef.current = component;
    if (elementRef.current) {
      try {
        elementRef.current.setAttribute('data-testid', 'hook-wrapper');
        componentRef.current.render(elementRef.current);
      } catch (error) {
        console.error('Error rendering Closure component:', error);
      }
    }
    return () => {
      if (componentRef.current) {
        try {
          componentRef.current.dispose();
        } catch (error) {
          console.error('Error disposing Closure component:', error);
        }
      }
    };
  }, [component]);

  const renderCallback = React.useCallback((element: HTMLDivElement | null) => {
    elementRef.current = element;
    if (element) {
      try {
        element.setAttribute('data-testid', 'hook-wrapper');
        componentRef.current.render(element);
      } catch (error) {
        console.error('Error rendering Closure component:', error);
      }
    }
  }, []);

  React.useEffect(() => {
    if (elementRef.current) {
      elementRef.current.setAttribute('data-testid', 'hook-wrapper');
    }
  }, []);

  return renderCallback;
}

export { Component, type ComponentInterface };
export { ClosureComponent } from './ClosureComponent';
