import { Component } from '@closure-next/core';

export class TestComponent extends Component {
  private title: string = '';

  setTitle(title: string): void {
    this.title = title;
  }

  getTitle(): string {
    return this.title;
  }
}
