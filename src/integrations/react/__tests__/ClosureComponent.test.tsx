import React from 'react';
import { render, cleanup } from '@testing-library/react';
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
});
