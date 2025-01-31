import { jest } from '@jest/globals';

const { JSDOM } = await import('jsdom');
await import('@testing-library/jest-dom');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  runScripts: 'dangerously'
});

globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.navigator = dom.window.navigator;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.HTMLDivElement = dom.window.HTMLDivElement;
globalThis.Event = dom.window.Event;
globalThis.CustomEvent = dom.window.CustomEvent;
globalThis.Node = dom.window.Node;
globalThis.NodeList = dom.window.NodeList;
globalThis.MutationObserver = dom.window.MutationObserver;

globalThis.requestAnimationFrame = function(callback) {
  return setTimeout(callback, 0);
};
globalThis.cancelAnimationFrame = function(id) {
  clearTimeout(id);
};

globalThis.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
