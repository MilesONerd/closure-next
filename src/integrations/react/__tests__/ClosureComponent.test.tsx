import React from 'react';
import { render, cleanup, screen, act, within } from '@testing-library/react';
import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { Component, DomHelper } from '@closure-next/core/dist/index.js';
import { ClosureComponent } from '../src/ClosureComponent.js';
import { TestComponent } from './TestComponent.js';

class ErrorComponent extends Component {
  constructor() {
    super(new DomHelper(document));
  }

  public override enterDocument(): void {
    throw new Error('Test error');
  }

  public override dispose(): void {
    const element = this.getElement();
    if (element) {
      element.remove();
    }
  }
}

jest.setTimeout(10000);

describe('ClosureComponent', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(async () => {
    cleanup();
    jest.runAllTimers();
    jest.useRealTimers();
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  it('should render and unmount component', () => {
    const { container, unmount } = render(
      <ClosureComponent component={TestComponent} />
    );

    const wrapper = screen.getByTestId("hook-wrapper");
    expect(wrapper).toBeInTheDocument();

    const element = screen.getByTestId("test-component");
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Test Component Content');

    unmount();
    expect(wrapper.querySelector('[data-testid="test-component"]')).toBeNull();
  });

  it('should handle component props', () => {
    const { container } = render(
      <ClosureComponent 
        component={TestComponent}
        props={{ title: 'Test Title' }}
      />
    );

    const wrapper = screen.getByTestId("hook-wrapper");
    expect(wrapper).toBeInTheDocument();

    const element = screen.getByTestId("test-component");
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('data-title', 'Test Title');
  });

  it('should handle errors with error boundary', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    act(() => {
      render(<ClosureComponent component={ErrorComponent} />);
    });
    
    const errorBoundaryRoot = screen.getByTestId('error-boundary-root');
    expect(errorBoundaryRoot).toBeInTheDocument();
    
    const errorElement = within(errorBoundaryRoot).getByTestId('closure-error');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent('Test error');
    
    consoleError.mockRestore();
  });

  it('should use custom fallback for errors', () => {
    const fallback = <div data-testid="custom-error">Custom Error</div>;
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    act(() => {
      render(<ClosureComponent component={ErrorComponent} fallback={fallback} />);
    });

    const errorBoundaryRoot = screen.getByTestId('error-boundary-root');
    expect(errorBoundaryRoot).toBeInTheDocument();

    const errorElement = within(errorBoundaryRoot).getByTestId('custom-error');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent('Custom Error');
    
    consoleError.mockRestore();
  });

  it('should not use error boundary when disabled', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<ClosureComponent component={ErrorComponent} errorBoundary={false} />);
    }).toThrow('Test error');
    
    consoleError.mockRestore();
  });
});
