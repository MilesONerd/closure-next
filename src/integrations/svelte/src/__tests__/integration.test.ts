import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { Component, DomHelper } from '@closure-next/core';
import { render } from '@testing-library/svelte';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import TestWrapper from './TestWrapper.svelte';

class TestComponent extends Component {
  constructor() {
    const domHelper = new DomHelper(document);
    super(domHelper);
  }

  override createDom(): void {
    const element = this.domHelper.createElement('div');
    element.setAttribute('data-testid', 'test-component');
    element.textContent = 'Test Content';
    this.element = element;
  }
}

describe('Svelte Integration', () => {
  let component: TestComponent;

  beforeEach(() => {
    document.body.innerHTML = '';
    component = new TestComponent();
    component.createDom();
  });

  test('renders component', () => {
    const { container } = render(TestWrapper, {
      props: { component }
    });

    const element = container.querySelector('[data-testid="test-component"]');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Test Content');
  });

  test('handles events', () => {
    const { container } = render(TestWrapper, {
      props: { component }
    });

    const element = container.querySelector('[data-testid="test-component"]');
    expect(element).toBeInTheDocument();

    const clickHandler = jest.fn();
    element?.addEventListener('click', clickHandler);

    fireEvent.click(element!);
    expect(clickHandler).toHaveBeenCalled();
  });
});
