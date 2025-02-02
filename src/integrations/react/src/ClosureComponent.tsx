import React from 'react';
import { Component, DomHelper, type ComponentInterface } from '@closure-next/core/dist/index.js';
import { useClosureComponent } from './index.js';

interface Props {
  component: new (domHelper?: DomHelper) => ComponentInterface;
  props?: Record<string, unknown>;
  errorBoundary?: boolean;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ClosureComponent Error:', error, errorInfo);
    if (!this.state.hasError) {
      this.setState({ hasError: true, error });
    }
  }

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      const errorContent = fallback || (
        <div className="closure-error" data-testid="closure-error">
          {error?.message || 'Unknown error'}
        </div>
      );
      return <div data-testid="error-boundary-root">{errorContent}</div>;
    }

    return children;
  }
}

const ClosureContent: React.FC<Props> = ({ component: Component, props = {} }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const componentRef = React.useRef<ComponentInterface | null>(null);

  React.useEffect(() => {
    if (ref.current && !componentRef.current) {
      const instance = new Component(new DomHelper(document));
      componentRef.current = instance;

      // Update props before entering document
      if (props) {
        Object.entries(props).forEach(([key, value]) => {
          const method = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
          if (typeof instance[method as keyof ComponentInterface] === 'function') {
            (instance[method as keyof ComponentInterface] as Function)(value);
          }
        });
      }

      instance.enterDocument();
      const element = instance.getElement();
      if (element) {
        ref.current.appendChild(element);
      }
    }

    return () => {
      if (componentRef.current) {
        try {
          componentRef.current.exitDocument();
          componentRef.current.dispose();
          componentRef.current = null;
        } catch (error) {
          console.error('Error disposing Closure component:', error);
        }
      }
    };
  }, [Component, props]);

  return <div ref={ref} data-testid="hook-wrapper" className="closure-wrapper" />;
};

export const ClosureComponent: React.FC<Props> = ({
  component,
  props,
  errorBoundary = true,
  fallback = null
}) => {
  if (!errorBoundary) {
    return <ClosureContent component={component} props={props} />;
  }

  return (
    <ErrorBoundary fallback={fallback}>
      <ClosureContent component={component} props={props} />
    </ErrorBoundary>
  );
}
