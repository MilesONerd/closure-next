import React from "react";
import { render, cleanup, act, screen } from "@testing-library/react";
import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { Component, type ComponentInterface, DomHelper } from "@closure-next/core";
import { useClosureComponent } from "../src/index";
import { TestComponent } from "../src/TestComponent";

class ErrorComponent extends Component {
  constructor() {
    super(new DomHelper(document));
  }

  render() {
    throw new Error("Test render error");
  }
}

const TestHook = ({ component }: { component: Component }) => {
  const ref = useClosureComponent(component);
  return <div ref={ref} />;
};

describe("useClosureComponent", () => {
  afterEach(cleanup);

  it("should render and unmount component", () => {
    const component = new TestComponent();
    const { container, unmount } = render(<TestHook component={component} />);
    
    const wrapper = screen.getByTestId("hook-wrapper");
    expect(wrapper).toBeInTheDocument();
    
    const element = wrapper.querySelector('[data-testid="test-component"]');
    expect(element).not.toBeNull();
    expect(element).toHaveTextContent("Test Component Content");
    
    unmount();
    expect(component.getElement()).toBeNull();
  });

  it("should handle component updates", () => {
    const component = new TestComponent();
    const { container } = render(<TestHook component={component} />);
    
    act(() => {
      component.setTitle("Updated Title");
    });
    
    const wrapper = screen.getByTestId("hook-wrapper");
    expect(wrapper).toBeInTheDocument();
    
    const element = wrapper.querySelector('[data-testid="test-component"]');
    expect(element).not.toBeNull();
    expect(element).toHaveAttribute("data-title", "Updated Title");
  });

  it("should cleanup on unmount", () => {
    const component = new TestComponent();
    const { unmount } = render(<TestHook component={component} />);
    
    const wrapper = screen.getByTestId("hook-wrapper");
    expect(wrapper).toBeInTheDocument();
    
    const element = wrapper.querySelector('[data-testid="test-component"]');
    expect(element).not.toBeNull();
    unmount();
    expect(component.getElement()).toBeNull();
  });

  it("should handle render errors gracefully", () => {
    const component = new ErrorComponent();
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    
    render(<TestHook component={component} />);
    
    expect(consoleError).toHaveBeenCalledWith(
      "Error rendering Closure component:",
      expect.any(Error)
    );
    
    consoleError.mockRestore();
  });

  it("should handle dispose errors gracefully", () => {
    class DisposeErrorComponent extends Component {
      constructor() {
        super(new DomHelper(document));
      }

      dispose() {
        throw new Error("Test dispose error");
      }
    }

    const component = new DisposeErrorComponent();
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    
    const { unmount } = render(<TestHook component={component} />);
    unmount();
    
    expect(consoleError).toHaveBeenCalledWith(
      "Error disposing Closure component:",
      expect.any(Error)
    );
    
    consoleError.mockRestore();
  });
});
