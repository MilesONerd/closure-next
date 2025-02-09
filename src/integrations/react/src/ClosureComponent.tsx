import { Component, DOMHelper } from '@closure-next/core';
import type { ComponentInterface, ComponentState } from '@closure-next/core';
import React, { useEffect, useRef } from 'react';

interface ClosureInstance<T extends Component> {
  component: T;
  domHelper: DOMHelper;
}

interface ClosureContentProps<T extends Component> {
  component: T;
  domHelper: DOMHelper;
  children?: React.ReactNode;
}

function ClosureContent<T extends Component>({
  component,
  domHelper,
  children
}: ClosureContentProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<ClosureInstance<T>>({ component, domHelper });

  useEffect(() => {
    if (containerRef.current) {
      component.render(containerRef.current);
    }
    return () => {
      component.dispose();
    };
  }, [component]);

  return <div ref={containerRef}>{children}</div>;
}

interface ClosureComponentProps<T extends Component> {
  component: T;
  domHelper: DOMHelper;
  children?: React.ReactNode;
}

export function ClosureComponent<T extends Component>({
  component,
  domHelper,
  children
}: ClosureComponentProps<T>) {
  return (
    <ClosureContent component={component} domHelper={domHelper}>
      {children}
    </ClosureContent>
  );
}
