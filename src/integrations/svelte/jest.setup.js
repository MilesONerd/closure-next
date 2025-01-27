// Jest setup for Svelte integration tests
require('@testing-library/jest-dom');

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

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = function(callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function(id) {
  clearTimeout(id);
};

// Add custom matchers to Jest
expect.extend({
  toHaveAttribute(element, attr, value) {
    if (!element || typeof element.getAttribute !== 'function') {
      return {
        pass: false,
        message: () => `expected element to be a DOM element with getAttribute method`
      };
    }
    const actualValue = element.getAttribute(attr);
    const pass = actualValue === value;
    return {
      pass,
      message: () =>
        pass
          ? `expected element not to have attribute ${attr}=${value}`
          : `expected element to have attribute ${attr}=${value} but got ${actualValue}`
    };
  }
});

// Set up fake timers
jest.useFakeTimers();

// Clean up between tests
beforeEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
  jest.useRealTimers();
});
