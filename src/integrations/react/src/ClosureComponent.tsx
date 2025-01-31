import React from 'react';
import type { ComponentInterface } from '@closure-next/core';
import { useClosureComponent } from './index';

interface Props {
  component: ComponentInterface;
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

const ClosureContent: React.FC<Props> = ({ component, props = {} }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      try {
        ref.current.setAttribute("data-testid", "hook-wrapper");
        component.render(ref.current);
      } catch (error) {
        console.error('Error rendering Closure component:', error);
        throw error;
      }
    }

    return () => {
      try {
        component.dispose();
      } catch (error) {
        console.error('Error disposing Closure component:', error);
      }
    };
  }, [component]);

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
