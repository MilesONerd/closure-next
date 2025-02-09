import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Set up TextEncoder/TextDecoder polyfills
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Set up JSDOM
const { JSDOM } = require('jsdom');
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
  MutationObserver: { value: dom.window.MutationObserver }
});

// Make JSDOM available globally
(global as any).JSDOM = JSDOM;
