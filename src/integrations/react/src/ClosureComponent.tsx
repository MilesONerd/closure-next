import React from 'react';
import type { ClosureComponentProps, ErrorBoundaryProps, ErrorBoundaryState, ClosureInstance } from './types';
import { DomHelper } from '@closure-next/core/dist/index.js';

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ClosureComponent Error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render(): React.ReactNode {
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

function ClosureContent<T extends Component>({ 
  component: ComponentClass, 
  props = {} 
}: ClosureComponentProps<T>): JSX.Element {
  const ref = React.useRef<HTMLDivElement>(null);
  const componentRef = React.useRef<ClosureInstance<T> | null>(null);

  React.useEffect(() => {
    if (ref.current && !componentRef.current) {
      const instance = new ComponentClass(new DomHelper(document)) as ClosureInstance<T>;
      componentRef.current = instance;

      // Update props before entering document
      if (props) {
        Object.entries(props).forEach(([key, value]) => {
          const method = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
          if (typeof instance[method as keyof typeof instance] === 'function') {
            (instance[method as keyof typeof instance] as Function)(value);
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
  }, [ComponentClass, props]);

  return <div ref={ref} data-testid="hook-wrapper" className="closure-wrapper" />;
}

export function ClosureComponent<T extends Component>({
  component,
  props,
  errorBoundary = true,
  fallback = null
}: ClosureComponentProps<T>): JSX.Element {
  if (!errorBoundary) {
    return <ClosureContent component={component} props={props} />;
  }

  return (
    <ErrorBoundary fallback={fallback}>
      <ClosureContent component={component} props={props} />
    </ErrorBoundary>
  );
}
