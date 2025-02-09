import { Component, ComponentProps, ComponentInterface, DomHelper } from '@closure-next/core/dist/index.js';
import { MutableRefObject } from 'react';

/**
 * Enhanced props type for Closure components in React
 */
export interface ClosureComponentProps<T extends Component = Component> {
  component: new (domHelper?: DomHelper) => T;
  props?: ComponentProps;
  errorBoundary?: boolean;
  fallback?: React.ReactNode;
}

/**
 * Hook return type for useClosureComponent
 */
export interface UseClosureComponentReturn<T extends Component = Component> {
  ref: MutableRefObject<HTMLDivElement | null>;
  component: MutableRefObject<T | null>;
  setProps: (props: Partial<ComponentProps>) => void;
}

/**
 * Error boundary state type
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary props type
 */
export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Component instance type
 */
export type ClosureInstance<T extends Component = Component> = T & ComponentInterface;
