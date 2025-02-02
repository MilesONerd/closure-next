import React from "react";
import { render, cleanup, act, screen } from "@testing-library/react";
import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { Component, type ComponentInterface, DomHelper } from "@closure-next/core/dist/index.js";
import { useClosureComponent } from "../src/index.js";
import { TestComponent } from "./TestComponent.js";

class ErrorComponent extends Component {
  constructor(domHelper?: DomHelper) {
    super(domHelper || new DomHelper(document));
  }

  public override createDom(): void {
    throw new Error("Test render error");
  }
}

const TestHook = ({ ComponentClass }: { ComponentClass: new (domHelper?: DomHelper) => ComponentInterface }) => {
  const ref = useClosureComponent(ComponentClass);
  return <div ref={ref} />;
};

describe("useClosureComponent", () => {
  afterEach(cleanup);

  it("should render and unmount component", () => {
    const { container, unmount } = render(<TestHook ComponentClass={TestComponent} />);
    
    const wrapper = screen.getByTestId("hook-wrapper");
    expect(wrapper).toBeInTheDocument();
    
    const element = wrapper.querySelector('[data-testid="test-component"]');
    expect(element).not.toBeNull();
    expect(element).toHaveTextContent("Test Component Content");
    
    unmount();
    const testElement = wrapper.querySelector('[data-testid="test-component"]');
    expect(testElement).toBeNull();
  });

  it("should handle component updates", () => {
    const { container } = render(<TestHook ComponentClass={TestComponent} />);
    const wrapper = screen.getByTestId("hook-wrapper");
    const element = wrapper.querySelector('[data-testid="test-component"]');
    
    expect(element).not.toBeNull();
    expect(element?.getAttribute("data-title")).toBe("");
    
    // Update the component through direct DOM manipulation
    act(() => {
      element?.setAttribute("data-title", "Updated Title");
    });
    
    const updatedElement = wrapper.querySelector('[data-testid="test-component"]');
    expect(updatedElement).not.toBeNull();
    expect(updatedElement?.getAttribute("data-title")).toBe("Updated Title");
  });

  it("should cleanup on unmount", () => {
    const { unmount } = render(<TestHook ComponentClass={TestComponent} />);
    
    const wrapper = screen.getByTestId("hook-wrapper");
    expect(wrapper).toBeInTheDocument();
    
    const element = wrapper.querySelector('[data-testid="test-component"]');
    expect(element).not.toBeNull();
    
    unmount();
    expect(wrapper.querySelector('[data-testid="test-component"]')).toBeNull();
  });

  it("should handle render errors gracefully", () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    
    render(<TestHook ComponentClass={ErrorComponent} />);
    
    expect(consoleError).toHaveBeenCalledWith(
      "Error rendering Closure component:",
      expect.any(Error)
    );
    
    consoleError.mockRestore();
  });

  it("should handle dispose errors gracefully", () => {
    class DisposeErrorComponent extends Component {
      constructor(domHelper?: DomHelper) {
        super(domHelper || new DomHelper(document));
      }

      public override dispose(): void {
        throw new Error("Test dispose error");
      }

      public override createDom(): void {
        const element = document.createElement("div");
        element.setAttribute("data-testid", "error-component");
      }
    }

    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    
    const { unmount } = render(<TestHook ComponentClass={DisposeErrorComponent} />);
    unmount();
    
    expect(consoleError).toHaveBeenCalledWith(
      "Error cleaning up previous component:",
      expect.any(Error)
    );
    
    consoleError.mockRestore();
  });
});
