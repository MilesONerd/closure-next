// Add Jest DOM matchers
require('@testing-library/jest-dom');

// Set up JSDOM environment
const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  runScripts: 'dangerously'
});

// Set up globals
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.HTMLDivElement = dom.window.HTMLDivElement;
global.Event = dom.window.Event;
global.CustomEvent = dom.window.CustomEvent;
global.Node = dom.window.Node;
global.NodeList = dom.window.NodeList;
global.MutationObserver = dom.window.MutationObserver;

// Mock requestAnimationFrame
global.requestAnimationFrame = function(callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function(id) {
  clearTimeout(id);
};

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Add test utilities
global.createTestElement = () => {
  const element = document.createElement('div');
  document.body.appendChild(element);
  return element;
};

// Add event tracking utilities
global.trackEventListeners = (element) => {
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
