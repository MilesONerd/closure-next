import { Component } from '@closure-next/core';

// This export should be tree-shaken
export const unused_export = 'unused';

class TestComponent extends Component {
  private title: string = '';
  
  setTitle(title: string): void {
    this.title = title;
    if (this.element) {
      this.element.setAttribute('data-title', title);
    }
  }
  
  getTitle(): string {
    return this.title;
  }
}

export default TestComponent;
