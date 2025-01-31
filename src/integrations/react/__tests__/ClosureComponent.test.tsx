import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import { ClosureComponent } from '../src/ClosureComponent';
import { TestComponent } from './TestComponent';

describe('ClosureComponent', () => {
  afterEach(cleanup);

  it('should render and unmount component', () => {
    const component = new TestComponent();
    const { container, unmount } = render(
      <ClosureComponent component={component} />
    );

    const wrapper = container.querySelector('[data-testid="closure-wrapper"]');
    expect(wrapper).toBeTruthy();

    const element = wrapper?.querySelector('[data-testid="test-component"]');
    expect(element).toBeTruthy();
    expect(element?.textContent).toBe('Test Component Content');

    unmount();
    expect(component.getElement()).toBeFalsy();
  });

  it('should handle component props', () => {
    const component = new TestComponent();
    const { container } = render(
      <ClosureComponent 
        component={component}
        props={{ title: 'Test Title' }}
      />
    );

    const wrapper = container.querySelector('[data-testid="closure-wrapper"]');
    expect(wrapper).toBeTruthy();

    const element = wrapper?.querySelector('[data-testid="test-component"]');
    expect(element).toBeTruthy();
    expect(element?.getAttribute('data-title')).toBe('Test Title');
  });

  it('should handle errors with error boundary', () => {
    const ErrorComponent = class extends TestComponent {
      render() {
        throw new Error('Test error');
      }
    };

    const component = new ErrorComponent();
    render(<ClosureComponent component={component} />);

    const errorElement = screen.getByTestId('closure-error');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toContain('Test error');
  });

  it('should use custom fallback for errors', () => {
    const ErrorComponent = class extends TestComponent {
      render() {
        throw new Error('Test error');
      }
    };

    const component = new ErrorComponent();
    const fallback = <div data-testid="custom-error">Custom Error</div>;
    render(<ClosureComponent component={component} fallback={fallback} />);

    const errorElement = screen.getByTestId('custom-error');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toBe('Custom Error');
  });

  it('should not use error boundary when disabled', () => {
    const ErrorComponent = class extends TestComponent {
      render() {
        throw new Error('Test error');
      }
    };

    const component = new ErrorComponent();
    expect(() => {
      render(<ClosureComponent component={component} errorBoundary={false} />);
    }).toThrow('Test error');
  });
});
