import '@testing-library/jest-dom';

// Set up TextEncoder/TextDecoder polyfills
const util = require('util');
Object.defineProperties(global, {
  TextEncoder: { value: util.TextEncoder },
  TextDecoder: { value: util.TextDecoder }
});

// Import JSDOM after polyfills are set up
const { JSDOM } = require('jsdom');

// Set up JSDOM for SSR tests
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  runScripts: 'dangerously'
});

Object.defineProperties(global, {
  document: { value: dom.window.document },
  window: { value: dom.window },
  navigator: { value: dom.window.navigator },
  DOMParser: { value: dom.window.DOMParser },
  Node: { value: dom.window.Node },
  Element: { value: dom.window.Element },
  HTMLElement: { value: dom.window.HTMLElement },
  Event: { value: dom.window.Event },
  CustomEvent: { value: dom.window.CustomEvent },
  MutationObserver: { value: dom.window.MutationObserver },
  JSDOM: { value: JSDOM }
});
