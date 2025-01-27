// Jest setup for Vue integration tests
require('@testing-library/jest-dom');

// Configure Jest's expect
expect.addSnapshotSerializer({
  test: (val) => val && val.nodeType === 1,
  print: (val) => val.outerHTML
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
