import React from "react";
import { render, cleanup } from "@testing-library/react";
import { useClosureComponent } from "../src/index";
import { TestComponent } from "./TestComponent";

const TestHook = ({ component }: { component: TestComponent }) => {
  const ref = useClosureComponent(component);
  return <div ref={ref} />;
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
    
    component.setTitle("Updated Title");
    
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
});
