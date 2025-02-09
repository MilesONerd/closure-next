const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

Object.defineProperty(window, 'requestIdleCallback', {
  value: (cb) => setTimeout(cb, 0)
});

Object.defineProperty(window, 'cancelIdleCallback', {
  value: (id) => clearTimeout(id)
});

// Mock Angular's platform-server environment
jest.mock('@angular/common', () => ({
  ...jest.requireActual('@angular/common'),
  isPlatformServer: () => true
}));
