import { Component, DomHelper } from '@closure-next/core';

// This export should be tree-shaken
export const unused_export = 'unused';

class TestComponent extends Component {
  private title: string = '';
  
  constructor(domHelper: DomHelper) {
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

  public override createDom(): void {
    if (!this.element) {
      super.createDom();
      const element = this.getElement();
      if (element) {
        element.setAttribute('data-testid', 'test-component');
        element.setAttribute('data-title', this.title);
        element.textContent = `Test Component Content - ${this.title}`;
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

  public override dispose(): void {
    if (this.isInDocument()) {
      this.exitDocument();
    }
    if (this.element && this.element.parentElement) {
      this.element.parentElement.removeChild(this.element);
    }
    super.dispose();
  }
}

export default TestComponent;
