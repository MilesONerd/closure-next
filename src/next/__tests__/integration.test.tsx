import { renderToString } from '../src/index.js';
import { Component, DomHelper, ComponentInterface } from '@closure-next/core';
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

class TestComponent extends Component implements ComponentInterface {
  private title: string = '';
  private domHelper: DomHelper;

  constructor() {
    const domHelper = new DomHelper(document);
    super(domHelper);
    this.domHelper = domHelper;
  }

  protected override createDom(): void {
    const element = this.domHelper.createElement('div');
    element.setAttribute('data-testid', 'test-component');
    element.setAttribute('data-title', this.title);
    element.textContent = this.title;
    this.element = element;
  }

  public setTitle(title: string): void {
    this.title = title;
    const element = this.getElement();
    if (element) {
      element.setAttribute('data-title', title);
      element.textContent = title;
    }
  }

  public override enterDocument(): void {
    super.enterDocument();
    if (!this.getElement()) {
      this.createDom();
    }
  }

  public override exitDocument(): void {
    const element = this.getElement();
    if (element?.parentElement) {
      element.parentElement.removeChild(element);
    }
    super.exitDocument();
  }

  public override dispose(): void {
    if (this.isInDocument()) {
      this.exitDocument();
    }
    super.dispose();
  }
}

describe('Next.js Integration', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  test('should render component to string', async () => {
    const html = await renderToString(TestComponent);
    expect(html).toContain('data-testid="test-component"');
  });

  test('should handle props during SSR', async () => {
    const html = await renderToString(TestComponent, { title: 'SSR Title' });
    expect(html).toContain('data-title="SSR Title"');
    expect(html).toContain('SSR Title');
  });

  test('should handle component lifecycle', () => {
    const component = new TestComponent();
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    component.enterDocument();
    container.appendChild(component.getElement()!);
    expect(container.innerHTML).toContain('data-testid="test-component"');
    
    component.setTitle('Updated Title');
    expect(container.innerHTML).toContain('Updated Title');
    
    component.dispose();
    expect(container.innerHTML).toBe('');
    
    document.body.removeChild(container);
  });
});
