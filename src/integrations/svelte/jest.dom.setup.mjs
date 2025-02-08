import { JSDOM } from 'jsdom';

const jsdom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true
});

Object.assign(global, {
  window: jsdom.window,
  document: jsdom.window.document,
  navigator: jsdom.window.navigator,
  HTMLElement: jsdom.window.HTMLElement,
  Element: jsdom.window.Element,
  Node: jsdom.window.Node,
  SVGElement: jsdom.window.SVGElement,
  getComputedStyle: jsdom.window.getComputedStyle,
  requestAnimationFrame: callback => setTimeout(callback, 0),
  cancelAnimationFrame: id => clearTimeout(id),
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
  ResizeObserver: class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
});
