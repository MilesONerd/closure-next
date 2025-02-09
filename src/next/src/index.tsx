/**
 * @fileoverview Next.js integration for Closure Next.
 * @license Apache-2.0
 */

import React from 'react';
import type { NextPage, NextComponentType, NextPageContext } from 'next';
import type { Component } from '@closure-next/core';

// Add JSX namespace
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
  }
}

interface WithClosureNextOptions {
  /** Enable SSR for Closure components */
  ssr?: boolean;
  /** Hydration strategy */
  hydration?: 'client-only' | 'server-first' | 'progressive';
}

/**
 * HOC to wrap Next.js pages with Closure Next support
 */
export function withClosureNext<P extends React.JSX.IntrinsicAttributes = {}>(
  PageComponent: NextComponentType<NextPageContext, any, P>,
  options: WithClosureNextOptions = {}
): NextPage<P> {
  const { ssr = true, hydration = 'progressive' } = options;

  const WrappedPage: NextPage<P> = (props: P) => {
    // Handle client-side only rendering
    if (!ssr && typeof window === 'undefined') {
      return null;
    }

    const Component = PageComponent as unknown as React.ComponentType<P>;
    return <Component {...props} />;
  };

  // Copy static methods
  if (PageComponent.getInitialProps) {
    WrappedPage.getInitialProps = PageComponent.getInitialProps;
  }

  return WrappedPage;
}

/**
 * Server-side renderer for Closure components
 */
export function renderToString(
  ComponentClass: new () => Component,
  props?: Record<string, unknown>
): string {
  const component = new ComponentClass();
  
  // Apply props before rendering
  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      (component as any)[key] = value;
    });
  }

  // Create a temporary element for rendering
  const element = document.createElement('div');
  component.render(element);
  
  // Get the rendered HTML
  const html = element.innerHTML;
  
  // Clean up
  component.dispose();
  
  return html;
}

/**
 * Client-side hydration for Closure components
 */
export function hydrateComponent<T extends Component>(
  ComponentClass: new () => T,
  element: HTMLElement,
  props?: Record<string, unknown>
): T {
  const component = new ComponentClass();
  
  // Apply props before hydration
  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      (component as any)[key] = value;
    });
  }

  // Hydrate the component
  component.render(element);
  
  return component;
}

/**
 * React component for Closure components with SSR support
 */
export function ClosureComponent<T extends Component>({
  component: ComponentClass,
  props,
  ssr = true
}: {
  component: new () => T;
  props?: Record<string, unknown>;
  ssr?: boolean;
}): JSX.Element {
  const ref = React.useRef<HTMLDivElement>(null);
  const componentRef = React.useRef<T | null>(null);

  React.useEffect(() => {
    if (!ref.current) return;

    // Hydrate or render the component
    componentRef.current = hydrateComponent(ComponentClass, ref.current, props);

    return () => {
      if (componentRef.current) {
        componentRef.current.dispose();
        componentRef.current = null;
      }
    };
  }, [ComponentClass]);

  // Handle server-side rendering
  if (ssr && typeof window === 'undefined') {
    const html = renderToString(ComponentClass, props);
    return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return <div ref={ref} />;
}
