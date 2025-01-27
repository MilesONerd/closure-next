// Jest setup for React integration tests
require('@testing-library/jest-dom');

// Configure Jest's expect
expect.extend({
  toHaveAttribute(element, attr, value) {
    const actualValue = element.getAttribute(attr);
    const pass = actualValue === value;
    return {
      pass,
      message: () =>
        `expected element to have attribute ${attr}=${value} but got ${actualValue}`
    };
  }
});

// Basic DOM setup
document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Clean up between tests
beforeEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
});

afterEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
});
