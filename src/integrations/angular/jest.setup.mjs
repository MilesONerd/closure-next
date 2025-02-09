import { TextEncoder, TextDecoder } from 'util';
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

Object.defineProperty(window, 'requestIdleCallback', {
  value: (cb) => setTimeout(cb, 0)
});

Object.defineProperty(window, 'cancelIdleCallback', {
  value: (id) => clearTimeout(id)
});

// Mock Angular's platform-server environment
const mockIsPlatformServer = () => true;
export { mockIsPlatformServer as isPlatformServer } from '@angular/common';
