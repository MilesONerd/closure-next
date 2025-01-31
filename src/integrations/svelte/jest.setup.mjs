import { jest } from '@jest/globals';
import { TextEncoder, TextDecoder } from 'util';
import { configure } from '@testing-library/dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from '@jest/globals';

const { JSDOM } = await import('jsdom');

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}
if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder;
}

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  runScripts: 'dangerously'
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

Object.keys(dom.window).forEach(property => {
  if (typeof global[property] === 'undefined') {
    global[property] = dom.window[property];
  }
});

global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = id => clearTimeout(id);

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

configure({ testIdAttribute: 'data-testid' });
expect.extend(matchers);
