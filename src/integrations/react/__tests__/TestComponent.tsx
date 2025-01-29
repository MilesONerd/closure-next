import { Component } from "@closure-next/core";

export class TestComponent extends Component {
  private title: string = "";

  protected override createDom(): void {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-testid", "test-component");
    wrapper.setAttribute("data-title", this.title);
    wrapper.textContent = "Test Component Content";
    this._element = wrapper;
  }

  public setTitle(title: string): void {
    this.title = title;
    const element = this.getElement();
    if (element) {
      element.setAttribute("data-title", title);
    }
  }
}
