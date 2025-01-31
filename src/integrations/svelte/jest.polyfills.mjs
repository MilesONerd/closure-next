import { TextEncoder, TextDecoder } from 'util';

Object.defineProperties(globalThis, {
  TextEncoder: { value: TextEncoder },
  TextDecoder: { value: TextDecoder },
});
