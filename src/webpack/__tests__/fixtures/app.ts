import { Component, DOMHelper } from '@closure-next/core';

// This constant should be tree-shaken
const UNUSED_CONSTANT = 'unused';

// Only use the class, not the unused constant
class TestComponent extends Component {
  private title: string = '';
  
  constructor(domHelper: DOMHelper) {
    super(domHelper);
  }

  setTitle(title: string): void {
    this.title = title;
    if (this.element) {
      this.element.setAttribute('data-title', title);
      this.element.textContent = `Test Component Content - ${title}`;
    }
  }
  
  getTitle(): string {
    return this.title;
  }

  protected override async createDom(): Promise<void> {
    if (!this.element) {
      await super.createDom();
      const element = this.getElement();
      if (element) {
        element.setAttribute('data-testid', 'test-component');
        element.setAttribute('data-title', this.title);
        element.textContent = `Test Component Content - ${this.title}`;
      }
    }
  }

  public override async render(container: HTMLElement): Promise<void> {
    if (!this.element) {
      await this.createDom();
    }
    await super.render(container);
  }

  public override dispose(): void {
    if (this.element && this.element.parentElement) {
      this.element.parentElement.removeChild(this.element);
    }
    super.dispose();
  }
}

export default TestComponent;
