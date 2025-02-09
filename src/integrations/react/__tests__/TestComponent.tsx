import { Component, DOMHelper } from "@closure-next/core/dist/index.js";

export class TestComponent extends Component {
  private title: string = "";
  protected element: HTMLElement | null = null;

  constructor(domHelper?: DOMHelper) {
    super(domHelper || new DOMHelper(document));
    this.element = document.createElement("div");
  }

  public override createDom(): void {
    if (!this.element) {
      this.element = document.createElement("div");
    }
    this.element.setAttribute("data-testid", "test-component");
    this.element.setAttribute("data-title", this.title);
    this.element.textContent = "Test Component Content";
  }

  public override getElement(): HTMLElement | null {
    return this.element;
  }

  public setTitle(title: string): void {
    this.title = title;
    if (this.element) {
      this.element.setAttribute("data-title", title);
    }
  }

  public getTitle(): string {
    return this.title;
  }

  public override dispose(): void {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
    super.dispose();
  }

  public override enterDocument(): void {
    super.enterDocument();
    this.createDom();
  }

  public override exitDocument(): void {
    if (this.element) {
      this.element.remove();
    }
    super.exitDocument();
  }
}
