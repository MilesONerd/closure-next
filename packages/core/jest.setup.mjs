import '@testing-library/jest-dom';
import { JSDOM } from 'jsdom';
import { jest } from '@jest/globals';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  runScripts: 'dangerously'
});

// Set up globals
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

// Mock requestAnimationFrame
globalThis.requestAnimationFrame = function(callback) {
  return setTimeout(callback, 0);
};
globalThis.cancelAnimationFrame = function(id) {
  clearTimeout(id);
};

// Mock ResizeObserver
globalThis.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Add test utilities
globalThis.createTestElement = () => {
  const element = document.createElement('div');
  document.body.appendChild(element);
  return element;
};

// Add event tracking utilities
globalThis.trackEventListeners = (element) => {
  const listeners = new Map();
  
  const originalAddEventListener = element.addEventListener;
  element.addEventListener = function(type, listener, options) {
    if (!listeners.has(type)) {
      listeners.set(type, new Set());
    }
    listeners.get(type).add(listener);
    return originalAddEventListener.call(this, type, listener, options);
  };

  const originalRemoveEventListener = element.removeEventListener;
  element.removeEventListener = function(type, listener, options) {
    const typeListeners = listeners.get(type);
    if (typeListeners) {
      typeListeners.delete(listener);
    }
    return originalRemoveEventListener.call(this, type, listener, options);
  };

  element.getEventListeners = (type) => {
    return Array.from(listeners.get(type) || []);
  };

  return element;
};

// Enhance createElement to track event listeners
const originalCreateElement = document.createElement;
document.createElement = function(tagName) {
  const element = originalCreateElement.call(document, tagName);
  return trackEventListeners(element);
};
