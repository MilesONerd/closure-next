import { TextEncoder, TextDecoder } from 'node:util';
import { jest, describe, test, expect, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';

// Set up TextEncoder/TextDecoder before anything else
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Set up test environment globals
Object.assign(global, {
  jest,
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll
});

// Now we can safely import JSDOM
const { JSDOM } = await import('jsdom');

// Create JSDOM instance
const jsdom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  runScripts: 'dangerously'
});

// Set up DOM environment
Object.assign(global, {
  window: jsdom.window,
  document: jsdom.window.document,
  navigator: jsdom.window.navigator,
  HTMLElement: jsdom.window.HTMLElement,
  Element: jsdom.window.Element,
  Node: jsdom.window.Node,
  SVGElement: jsdom.window.SVGElement,
  getComputedStyle: jsdom.window.getComputedStyle,
  MutationObserver: jsdom.window.MutationObserver,
  CustomEvent: jsdom.window.CustomEvent,
  Event: jsdom.window.Event,
  KeyboardEvent: jsdom.window.KeyboardEvent,
  MouseEvent: jsdom.window.MouseEvent,
  DOMParser: jsdom.window.DOMParser,
  localStorage: jsdom.window.localStorage,
  sessionStorage: jsdom.window.sessionStorage,
  URL: jsdom.window.URL,
  URLSearchParams: jsdom.window.URLSearchParams,
  requestAnimationFrame: callback => setTimeout(callback, 0),
  cancelAnimationFrame: id => clearTimeout(id),
  ResizeObserver: class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
});

const { window } = jsdom;
const { document } = window;

// Set up basic DOM environment
Object.defineProperty(global, 'window', {
  value: window,
  writable: true
});

Object.defineProperty(global, 'document', {
  value: document,
  writable: true
});

Object.defineProperty(global, 'navigator', {
  value: window.navigator,
  writable: true
});

// Copy all properties from window to global
Object.getOwnPropertyNames(window).forEach(prop => {
  if (!(prop in global)) {
    Object.defineProperty(global, prop, {
      configurable: true,
      writable: true,
      value: window[prop]
    });
  }
});

// Set up event handling
class MockEvent {
  constructor(type, options = {}) {
    this.type = type;
    this.bubbles = !!options.bubbles;
    this.cancelable = !!options.cancelable;
    this.timeStamp = Date.now();
    this.defaultPrevented = false;
    this.propagationStopped = false;
    this.immediatePropagationStopped = false;
    this.composed = !!options.composed;
    this.target = null;
    this.currentTarget = null;
  }

  preventDefault() {
    if (this.cancelable) {
      this.defaultPrevented = true;
    }
  }

  stopPropagation() {
    this.propagationStopped = true;
  }

  stopImmediatePropagation() {
    this.immediatePropagationStopped = true;
    this.propagationStopped = true;
  }
}

global.Event = MockEvent;
global.CustomEvent = class CustomEvent extends MockEvent {
  constructor(type, options = {}) {
    super(type, options);
    this.detail = options.detail || null;
  }
};

// Set up animation frame methods
global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = id => clearTimeout(id);

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
