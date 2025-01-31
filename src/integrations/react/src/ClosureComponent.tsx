import React from 'react';
import type { ComponentInterface } from '@closure-next/core';
import { useClosureComponent } from './index';

interface Props {
  component: ComponentInterface;
  props?: Record<string, unknown>;
  errorBoundary?: boolean;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ClosureComponent extends React.Component<Props, State> {
  static defaultProps = {
    props: {},
    errorBoundary: true,
    fallback: null
  };

  state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ClosureComponent Error:', error, errorInfo);
  }

  private ref = React.createRef<HTMLDivElement>();
  private useClosureRef = useClosureComponent(this.props.component);

  componentDidMount(): void {
    this.updateProps();
  }

  componentDidUpdate(prevProps: Props): void {
    if (prevProps.props !== this.props.props) {
      this.updateProps();
    }
    if (this.ref.current) {
      this.useClosureRef(this.ref.current);
    }
  }

  private updateProps(): void {
    const { component, props = {} } = this.props;
    if (component && props) {
      Object.entries(props).forEach(([key, value]) => {
        const method = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
        if (typeof component[method as keyof ComponentInterface] === 'function') {
          (component[method as keyof ComponentInterface] as Function)(value);
        }
      });
    }
  }

  render(): React.ReactNode {
    if (this.state.hasError && this.props.errorBoundary) {
      return this.props.fallback || (
        <div className="closure-error" data-testid="closure-error">
          Error: {this.state.error?.message}
        </div>
      );
    }

    return <div ref={this.ref} data-testid="closure-wrapper" />;
  }
}
