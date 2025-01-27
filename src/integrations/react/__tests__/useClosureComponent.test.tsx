import React from 'react';
import { render, cleanup, act, waitFor } from '@testing-library/react';
import { Component, ComponentInterface, DomHelper, IdGenerator } from '@closure-next/core';
import { useClosureComponent, ClosureComponent } from '../index';

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

describe('useClosureComponent', () => {
  afterEach(() => {
    cleanup();
  });

  test('should create and mount component', async () => {
    const TestReact = () => {
      const ref = useClosureComponent(TestComponent);
      return <div ref={ref} />;
    };

    const { container } = render(<TestReact />);
    await act(async () => {
      // Wait for effects to complete
    });

    const element = container.firstChild;
    expect(element).not.toBeNull();
  });

  test('should apply initial props', async () => {
    const TestReact = () => {
      const ref = useClosureComponent(TestComponent, {
        title: 'Initial Title'
      });
      return <div ref={ref} />;
    };

    const { container } = render(<TestReact />);
    await act(async () => {
      // Wait for effects to complete
    });
    
    await waitFor(() => {
      const element = container.querySelector('[data-testid="test-component"]');
      expect(element).not.toBeNull();
      expect(element).toHaveAttribute('data-title', 'Initial Title');
    });
  });

  test('should handle prop updates', async () => {
    const TestReact = () => {
      const ref = useClosureComponent(TestComponent, {
        title: 'Initial Title'
      });
      
      React.useEffect(() => {
        const component = (ref.current as any)._closureComponent;
        if (component) {
          component.setTitle('Updated Title');
        }
      }, []);

      return <div ref={ref} />;
    };

    const { container } = render(<TestReact />);
    await act(async () => {
      // Wait for effects to complete
    });
    
    await waitFor(() => {
      const element = container.querySelector('[data-testid="test-component"]');
      expect(element).not.toBeNull();
      expect(element).toHaveAttribute('data-title', 'Updated Title');
    });
  });

  test('should clean up on unmount', async () => {
    const TestReact = () => {
      const ref = useClosureComponent(TestComponent);
      return <div ref={ref} />;
    };

    const { container, unmount } = render(<TestReact />);
    await act(async () => {
      // Wait for effects to complete
    });

    const element = container.firstChild;
    expect(element).not.toBeNull();

    const component = (element as any)._closureComponent;
    expect(component).toBeTruthy();
    const disposeSpy = jest.spyOn(component, 'dispose');

    await act(async () => {
      unmount();
    });
    expect(disposeSpy).toHaveBeenCalled();
  });
});
