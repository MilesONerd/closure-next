import React from "react";
import { render, cleanup, act } from "@testing-library/react";
import { useClosureComponent } from "../src/index";
import { TestComponent } from "./TestComponent";

const TestHook = ({ component }: { component: TestComponent }) => {
  const ref = useClosureComponent(component);
  return <div ref={ref} data-testid="hook-wrapper" />;
};

describe("useClosureComponent", () => {
  afterEach(cleanup);

  it("should render and unmount component", () => {
    const component = new TestComponent();
    const { container, unmount } = render(<TestHook component={component} />);
    
    const element = container.querySelector("[data-testid=test-component]");
    expect(element).toBeTruthy();
    expect(element?.textContent).toBe("Test Component Content");
    
    unmount();
    expect(component.getElement()).toBeFalsy();
  });

  it("should handle component updates", () => {
    const component = new TestComponent();
    const { container } = render(<TestHook component={component} />);
    
    act(() => {
      component.setTitle("Updated Title");
    });
    
    const element = container.querySelector("[data-testid=test-component]");
    expect(element).toBeTruthy();
    expect(element?.getAttribute("data-title")).toBe("Updated Title");
  });

  it("should cleanup on unmount", () => {
    const component = new TestComponent();
    const { unmount } = render(<TestHook component={component} />);
    
    expect(component.getElement()).toBeTruthy();
    unmount();
    expect(component.getElement()).toBeFalsy();
  });

  it("should handle render errors gracefully", () => {
    const ErrorComponent = class extends TestComponent {
      render() {
        throw new Error("Test render error");
      }
    };

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
    const ErrorComponent = class extends TestComponent {
      dispose() {
        throw new Error("Test dispose error");
      }
    };

    const component = new ErrorComponent();
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
