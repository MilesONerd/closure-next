import { Component, type ComponentInterface } from "@closure-next/core";
import React from "react";

export interface ClosureComponentProps {
  component: ComponentInterface;
  props?: Record<string, unknown>;
}

export function useClosureComponent(component: ComponentInterface): React.RefCallback<HTMLDivElement> {
  const componentRef = React.useRef<ComponentInterface>(component);

  React.useEffect(() => {
    componentRef.current = component;
  }, [component]);

  return React.useCallback((element: HTMLDivElement | null) => {
    if (element) {
      componentRef.current.render(element);
    } else if (componentRef.current) {
      componentRef.current.dispose();
    }
  }, []);
}

export { Component, type ComponentInterface };
export { ClosureComponent } from './ClosureComponent';
