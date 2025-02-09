import { Component, DOMHelper } from '@closure-next/core';
import type { ComponentInterface, ComponentState } from '@closure-next/core';
import React, { useEffect, useRef, useState } from 'react';

interface ClosureInstance<T extends Component> {
  component: T;
  domHelper: DOMHelper;
}

interface ClosureContentProps<T extends Component> {
  component: T;
  domHelper: DOMHelper;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

function ClosureContent<T extends Component>({
  component,
  domHelper,
  children,
  fallback
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

  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const setup = async () => {
      try {
        if (containerRef.current) {
          await component.render(containerRef.current);
        }
      } catch (err) {
        setError(err as Error);
      }
    };
    setup();
  }, [component]);

  if (error && fallback) {
    return <>{fallback}</>;
  }

  return <div ref={containerRef}>{children}</div>;
}

interface ClosureComponentProps<T extends Component> {
  component: T;
  domHelper: DOMHelper;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClosureComponent<T extends Component>({
  component,
  domHelper,
  children,
  fallback
}: ClosureComponentProps<T>) {
  return (
    <ClosureContent component={component} domHelper={domHelper} fallback={fallback}>
      {children}
    </ClosureContent>
  );
}
