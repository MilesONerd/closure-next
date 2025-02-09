import type { Component } from '@closure-next/core';

/**
 * Options for configuring a Closure component in Angular
 */
export interface ClosureComponentOptions<T extends typeof Component = typeof Component> {
  /**
   * The component constructor
   */
  component: T;
  
  /**
   * Props to pass to the component
   */
  props?: Record<string, any>;
  
  /**
   * Whether to wrap the component in an error boundary
   */
  errorBoundary?: boolean;
  
  /**
   * SSR options for the component
   */
  ssrOptions?: {
    /**
     * Hydration strategy
     */
    hydration?: 'client-only' | 'server-first' | 'progressive';
    
    /**
     * Whether to enable SSR
     */
    ssr?: boolean;
  };
}

/**
 * Interface for the Closure directive
 */
export interface ClosureDirective {
  /**
   * The component constructor
   */
  component: typeof Component;
  
  /**
   * Props to pass to the component
   */
  props?: Record<string, any>;
  
  /**
   * Whether to wrap the component in an error boundary
   */
  errorBoundary?: boolean;
  
  /**
   * SSR options for the component
   */
  ssrOptions?: {
    hydration?: 'client-only' | 'server-first' | 'progressive';
    ssr?: boolean;
  };
}

/**
 * Instance of a Closure component
 */
export type ClosureInstance<T extends typeof Component = typeof Component> = InstanceType<T>;

/**
 * Options for server-side rendering
 */
export interface SSROptions {
  /**
   * The component to render
   */
  component: typeof Component;
  
  /**
   * Props to pass to the component
   */
  props?: Record<string, any>;
  
  /**
   * Container ID for hydration
   */
  containerId: string;
  
  /**
   * Hydration strategy
   */
  hydration?: 'client-only' | 'server-first' | 'progressive';
}

/**
 * Options for client-side hydration
 */
export interface HydrationOptions {
  /**
   * The component to hydrate
   */
  component: typeof Component;
  
  /**
   * Props to pass to the component
   */
  props?: Record<string, any>;
  
  /**
   * Container ID for hydration
   */
  containerId: string;
  
  /**
   * Hydration strategy
   */
  hydration?: 'client-only' | 'server-first' | 'progressive';
}
