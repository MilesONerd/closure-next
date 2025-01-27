"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
// Test component definition
/**
 * Test component that extends the base Component class.
 * All public methods are inherited from Component.
 */
class TestComponent extends src_1.Component {
    constructor(domHelper) {
        super(domHelper);
        this.state = src_1.ComponentState.ALL;
    }
    getState() {
        return this.state;
    }
    setState(state) {
        this.state = state;
    }
    createDom() {
        if (!this.element) {
            super.createDom();
            const element = this.getElement();
            if (element) {
                element.setAttribute('data-testid', 'test-component');
            }
        }
    }
}
describe('Component', () => {
    let component;
    let container;
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        component = new TestComponent();
    });
    afterEach(() => {
        component.dispose();
        container.remove();
    });
    test('should render into container', () => {
        component.render(container);
        expect(component.getElement()).not.toBeNull();
        expect(component.isInDocument()).toBe(true);
    });
    test('should handle state changes', () => {
        component.setState(src_1.ComponentState.ACTIVE);
        expect(component.getState()).toBe(src_1.ComponentState.ACTIVE);
    });
    test('should handle events', () => {
        const handler = jest.fn();
        // First render the component
        component.render(container);
        expect(component.getElement()).not.toBeNull();
        expect(component.isInDocument()).toBe(true);
        // Then add the event listener
        component.addEventListener('click', handler);
        // Create and dispatch the event
        const event = new CustomEvent('click', {
            bubbles: true,
            cancelable: true,
            detail: { clicked: true }
        });
        component.dispatchEvent(event);
        // Verify the handler was called
        expect(handler).toHaveBeenCalled();
        expect(handler).toHaveBeenCalledWith(expect.any(Event));
    });
    test('should clean up on dispose', () => {
        component.render(container);
        const element = component.getElement();
        component.dispose();
        expect(component.getElement()).toBeNull();
        expect(element === null || element === void 0 ? void 0 : element.isConnected).toBe(false);
    });
    test('should handle parent-child relationships', () => {
        const parent = new TestComponent();
        const child = new TestComponent();
        // First render parent
        parent.render(container);
        expect(parent.getElement()).not.toBeNull();
        expect(parent.isInDocument()).toBe(true);
        // Then add child
        parent.addChild(child);
        expect(child.getParent()).toBe(parent);
        expect(child.getElement()).not.toBeNull();
        // Now render parent which should also render child
        parent.render(container);
        expect(parent.isInDocument()).toBe(true);
        expect(parent.getElement().isConnected).toBe(true);
        // Verify child state
        const childElement = child.getElement();
        expect(childElement).not.toBeNull();
        expect(childElement.parentElement).toBe(parent.getElement());
        expect(child.isInDocument()).toBe(true);
        expect(childElement.isConnected).toBe(true);
        // Dispose parent
        parent.dispose();
        // Verify parent cleanup
        expect(parent.getElement()).toBeNull();
        expect(parent.isInDocument()).toBe(false);
        // Verify child cleanup
        expect(child.getParent()).toBeNull();
        expect(child.getElement()).toBeNull();
        expect(child.isInDocument()).toBe(false);
    });
});
//# sourceMappingURL=component.test.js.map
