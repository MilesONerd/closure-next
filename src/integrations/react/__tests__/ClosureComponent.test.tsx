import React from 'react';
import { render, cleanup, act, waitFor } from '@testing-library/react';
import { Component, ComponentInterface, DomHelper, IdGenerator } from '@closure-next/core';
import { ClosureComponent } from '../index';

// Test component definition
class TestComponent extends Component implements ComponentInterface {
  private title: string = '';
  
  constructor(domHelper?: DomHelper) {
    super(domHelper);
  }

  public override getId(): string {
    return super.getId();
  }

  public override getElement(): HTMLElement | null {
    return super.getElement();
  }

  public override isInDocument(): boolean {
    return super.isInDocument();
  }

  public override getParent(): Component | null {
    return super.getParent();
  }

  public override addChild(child: Component): void {
    super.addChild(child);
  }

  public override removeChild(child: Component): void {
    super.removeChild(child);
  }

  public override render(opt_parentElement?: HTMLElement): void {
    super.render(opt_parentElement);
  }

  public override dispose(): void {
    super.dispose();
  }

  public override enterDocument(): void {
    super.enterDocument();
  }

  public override exitDocument(): void {
    super.exitDocument();
  }

  public override addEventListener(type: string, listener: (evt: Event) => void): void {
    super.addEventListener(type, listener);
  }

  public override removeEventListener(type: string, listener: (evt: Event) => void): void {
    super.removeEventListener(type, listener);
  }

  public override dispatchEvent(event: Event): boolean {
    return super.dispatchEvent(event);
  }

  setTitle(title: string): void {
    this.title = title;
    if (this.element) {
      this.element.setAttribute('data-title', this.title);
    }
  }
  
  getTitle(): string {
    return this.title;
  }

  protected override createDom(): void {
    super.createDom();
    if (this.element) {
      this.element.setAttribute('data-testid', 'test-component');
      this.element.setAttribute('data-title', this.title);
    }
  }
}

describe('ClosureComponent', () => {
  afterEach(() => {
    cleanup();
  });

  test('should render Closure component', async () => {
    const { container } = render(
      <ClosureComponent component={TestComponent} />
    );

    await waitFor(() => {
      const element = container.querySelector('[data-testid="closure-component"]');
      expect(element).not.toBeNull();
    });
  });

  test('should handle props', async () => {
    const { container } = render(
      <ClosureComponent 
        component={TestComponent}
        props={{ title: 'Test Title' }}
      />
    );
    
    await waitFor(() => {
      const element = container.querySelector('[data-testid="test-component"]');
      expect(element).not.toBeNull();
      expect(element).toHaveAttribute('data-title', 'Test Title');
    });
  });

  test('should update on prop changes', async () => {
    const { container, rerender } = render(
      <ClosureComponent 
        component={TestComponent}
        props={{ title: 'Initial Title' }}
      />
    );
    
    await waitFor(() => {
      const element = container.querySelector('[data-testid="test-component"]');
      expect(element).not.toBeNull();
      expect(element).toHaveAttribute('data-title', 'Initial Title');
    });
    
    rerender(
      <ClosureComponent 
        component={TestComponent}
        props={{ title: 'Updated Title' }}
      />
    );

    await waitFor(() => {
      const element = container.querySelector('[data-testid="test-component"]');
      expect(element).not.toBeNull();
      expect(element).toHaveAttribute('data-title', 'Updated Title');
    });
  });

  test('should clean up on unmount', async () => {
    const { container, unmount } = render(
      <ClosureComponent component={TestComponent} />
    );
    
    let component: any;
    await waitFor(() => {
      const element = container.querySelector('[data-testid="closure-component"]');
      expect(element).not.toBeNull();
      component = (element as any)._closureComponent;
      expect(component).toBeTruthy();
    });

    const disposeSpy = jest.spyOn(component, 'dispose');
    unmount();
    expect(disposeSpy).toHaveBeenCalled();
  });
});
