import { Component, ComponentState, ComponentInterface, DOMHelper } from '@closure-next/core/dist/index.js';
import { MutableRefObject } from 'react';

/**
 * Enhanced props type for Closure components in React
 */
export interface ClosureComponentState<T extends Component = Component> {
  component: new (domHelper?: DOMHelper) => T;
  props?: ComponentState;
  errorBoundary?: boolean;
  fallback?: React.ReactNode;
}

/**
 * Hook return type for useClosureComponent
 */
export interface UseClosureComponentReturn<T extends Component = Component> {
  ref: MutableRefObject<HTMLDivElement | null>;
  component: MutableRefObject<T | null>;
  setProps: (props: Partial<ComponentState>) => void;
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
