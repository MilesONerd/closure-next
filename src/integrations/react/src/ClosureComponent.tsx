import React from 'react';
import type { ComponentInterface } from '@closure-next/core';
import { useClosureComponent } from './index';

interface Props {
  component: ComponentInterface;
  props?: Record<string, unknown>;
}

export const ClosureComponent: React.FC<Props> = ({
  component,
  props = {}
}) => {
  const ref = useClosureComponent(component);

  React.useEffect(() => {
    if (component && props) {
      Object.entries(props).forEach(([key, value]) => {
        const method = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
        if (typeof component[method as keyof ComponentInterface] === 'function') {
          (component[method as keyof ComponentInterface] as Function)(value);
        }
      });
    }
  }, [component, props]);

  return <div ref={ref} data-testid="closure-wrapper" />;
};
