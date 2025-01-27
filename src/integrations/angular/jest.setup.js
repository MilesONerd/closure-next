import 'jest-preset-angular/setup-jest';
import '@testing-library/jest-dom';

// Mock DOM APIs
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

// Set up fake timers
beforeAll(() => {
  jest.useFakeTimers();
});

// Clean up between tests
beforeEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
  jest.clearAllTimers();
});

afterEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
  jest.clearAllTimers();
  jest.useRealTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

// Mock DOM APIs
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

// Set up fake timers
beforeAll(() => {
  jest.useFakeTimers();
});

// Clean up between tests
beforeEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
  jest.clearAllTimers();
  testBed.resetTestingModule();
});

afterEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
  jest.clearAllTimers();
  jest.useRealTimers();
  testBed.resetTestingModule();
});

afterAll(() => {
  jest.useRealTimers();
});
