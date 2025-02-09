import React from 'react';
import { render, cleanup, screen, act, within } from '@testing-library/react';
import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { Component, DOMHelper } from '@closure-next/core/dist/index.js';
import { ClosureComponent } from '../src/ClosureComponent.js';
import { TestComponent } from './TestComponent.js';

class ErrorComponent extends Component {
  constructor(domHelper: DOMHelper) {
    super(domHelper);
  }

  public async render(container: HTMLElement): Promise<void> {
    throw new Error('Test error');
  }

  public dispose(): void {
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
      <ClosureComponent component={new TestComponent()} domHelper={new DOMHelper(document)} />
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
        component={new TestComponent()} domHelper={new DOMHelper(document)}
      >
        <div data-title="Test Title" />
      </ClosureComponent>
    );

    const wrapper = screen.getByTestId("hook-wrapper");
    expect(wrapper).toBeInTheDocument();

    const element = screen.getByTestId("test-component");
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('data-title', 'Test Title');
  });

  it('should handle errors with error boundary', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    const domHelper = new DOMHelper(document);
    
    act(() => {
      render(<ClosureComponent component={new ErrorComponent(domHelper)} domHelper={domHelper} />);
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
    const domHelper = new DOMHelper(document);
    
    act(() => {
      render(<ClosureComponent component={new ErrorComponent(domHelper)} domHelper={domHelper} fallback={fallback} />);
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
    const domHelper = new DOMHelper(document);
    
    expect(() => {
      render(<ClosureComponent component={new ErrorComponent(domHelper)} domHelper={domHelper} children={null} />);
    }).toThrow('Test error');
    
    consoleError.mockRestore();
  });
});
