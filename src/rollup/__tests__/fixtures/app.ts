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

export async function loadComponent() {
  const { TestComponent } = await import('./TestComponent');
  return new TestComponent();
}
