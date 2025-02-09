import { jest, describe, test, beforeEach, afterEach, expect } from '@jest/globals';
import { Component, type ComponentInterface, type DOMHelper } from '@closure-next/core';
import { render, cleanup, waitFor, fireEvent } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import TestWrapper from './TestWrapper.svelte';

jest.setTimeout(10000);

console.log('Test file loaded');

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveClass(className: string): R;
      toBeVisible(): R;
      toBeInvalid(): R;
      toBeValid(): R;
      toBeRequired(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeEmpty(): R;
      toBePartiallyChecked(): R;
      toBeChecked(): R;
      toHaveValue(value?: string | string[] | number | null): R;
      toHaveStyle(css: string | Record<string, any>): R;
      toHaveFocus(): R;
      toHaveFormValues(values: Record<string, any>): R;
      toHaveDescription(text?: string | RegExp): R;
    }
  }
}

class TestComponent extends Component implements ComponentInterface {
  private title: string = '';
  
  constructor(domHelper?: DOMHelper) {
    super(domHelper);
  }

  setTitle(title: string): void {
    this.title = title;
    const element = this.getElement();
    if (element) {
      element.setAttribute('data-title', this.title);
    }
  }
  
  getTitle(): string {
    return this.title;
  }

  public override createDom(): void {
    if (!this.element) {
      super.createDom();
      const element = this.getElement();
      if (element) {
        element.setAttribute('data-testid', 'test-component');
        element.setAttribute('data-title', this.title);
      }
    }
  }

  public override enterDocument(): void {
    if (!this.isInDocument()) {
      super.enterDocument();
    }
  }

  public override exitDocument(): void {
    if (this.isInDocument()) {
      super.exitDocument();
    }
  }
}

describe('Svelte Integration', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  test('should render Closure component', async () => {
    const testComponent = new TestComponent();
    testComponent.createDom();
    
    const { container } = render(TestWrapper, {
      props: { component: testComponent }
    });

    await waitFor(() => {
      const wrapper = container.querySelector('[data-testid="closure-wrapper"]');
      const element = container.querySelector('[data-testid="test-component"]');
      expect(element).toBeInTheDocument();
      expect(wrapper).toBeInTheDocument();
    });
  });

  test('should handle props and updates', async () => {
    const testComponent = new TestComponent();
    testComponent.setTitle('Test Title');

    const { container } = render(TestWrapper, {
      props: { component: testComponent }
    });

    await waitFor(() => {
      const element = container.querySelector('[data-testid="test-component"]');
      expect(element).toBeInTheDocument();
      expect(element).toHaveAttribute('data-title', 'Test Title');
    });

    testComponent.setTitle('Updated Title');

    await waitFor(() => {
      const element = container.querySelector('[data-testid="test-component"]');
      expect(element).toHaveAttribute('data-title', 'Updated Title');
    });
  });

  test('should handle cleanup', async () => {
    const testComponent = new TestComponent();
    const { container } = render(TestWrapper, {
      props: { component: testComponent }
    });

    await waitFor(() => {
      const element = container.querySelector('[data-testid="test-component"]');
      expect(element).toBeInTheDocument();
    });

    const exitDocumentSpy = jest.spyOn(testComponent, 'exitDocument');
    cleanup();

    expect(exitDocumentSpy).toHaveBeenCalled();
  });

  test('should handle events', async () => {
    const testComponent = new TestComponent();
    const { container } = render(TestWrapper, {
      props: { component: testComponent }
    });

    await waitFor(() => {
      const element = container.querySelector('[data-testid="test-component"]');
      expect(element).toBeInTheDocument();
    });

    const element = container.querySelector('[data-testid="test-component"]');
    const clickHandler = jest.fn();
    element?.addEventListener('click', clickHandler);

    await fireEvent.click(element!);
    expect(clickHandler).toHaveBeenCalled();
  });
});
