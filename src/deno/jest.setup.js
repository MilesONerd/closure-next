// Jest setup for Deno integration tests
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

// Clean up between tests
beforeEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
});

afterEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
});
