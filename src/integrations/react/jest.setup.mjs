import { jest } from '@jest/globals';
import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom';

const { JSDOM } = await import('jsdom');

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

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = id => clearTimeout(id);

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Configure testing-library
import { configure } from '@testing-library/dom';
configure({ testIdAttribute: 'data-testid' });

// Extend expect with jest-dom matchers
import { expect } from '@jest/globals';
import * as matchers from '@testing-library/jest-dom';
expect.extend(matchers);
