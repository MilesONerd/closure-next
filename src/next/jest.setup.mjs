import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

global.jest = jest;

// Mock document for SSR tests
if (typeof document === 'undefined') {
  global.document = {
    createElement: () => ({
      setAttribute: () => {},
      appendChild: () => {},
      removeChild: () => {},
      textContent: '',
      parentElement: null,
      style: {}
    }),
    body: {
      appendChild: () => {},
      removeChild: () => {}
    }
  };
}

// Mock window for SSR tests
if (typeof window === 'undefined') {
  global.window = {
    document: global.document
  };
}
