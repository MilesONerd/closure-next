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
        componentRef.current.render(elementRef.current);
      } catch (error) {
        console.error('Error rendering Closure component:', error);
      }
    }
  }, [component]);

  return React.useCallback((element: HTMLDivElement | null) => {
    elementRef.current = element;
    if (element) {
      try {
        componentRef.current.render(element);
      } catch (error) {
        console.error('Error rendering Closure component:', error);
      }
    } else if (componentRef.current) {
      try {
        componentRef.current.dispose();
      } catch (error) {
        console.error('Error disposing Closure component:', error);
      }
    }
  }, []);
}

export { Component, type ComponentInterface };
export { ClosureComponent } from './ClosureComponent';
