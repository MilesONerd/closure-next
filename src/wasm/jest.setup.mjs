import { jest } from '@jest/globals';
import { TextEncoder, TextDecoder } from 'util';

global.jest = jest;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock WebAssembly for tests
global.WebAssembly = {
  instantiate: jest.fn(),
  compile: jest.fn(),
  instantiateStreaming: jest.fn(),
  compileStreaming: jest.fn(),
  validate: jest.fn(),
  Memory: jest.fn(),
  Table: jest.fn(),
  Module: jest.fn()
};
