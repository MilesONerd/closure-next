import { Component } from "@closure-next/core";

export class TestComponent extends Component {
  private title: string = "";

  protected override createDom(): void {
    const element = document.createElement("div");
    element.setAttribute("data-testid", "test-component");
    element.setAttribute("data-title", this.title);
    element.textContent = "Test Component Content";
    this._element = element;
  }

  public setTitle(title: string): void {
    this.title = title;
    if (this._element) {
      this._element.setAttribute("data-title", title);
    }
  }

  public getTitle(): string {
    return this.title;
  }
}
