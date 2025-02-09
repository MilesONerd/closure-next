const { TextEncoder, TextDecoder } = require('node:util');
const { JSDOM } = require('jsdom');

// Set up TextEncoder/TextDecoder globally
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Create a JSDOM instance
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
});

// Set up window and document globals
global.window = dom.window;
global.document = dom.window.document;

// Set up DOM classes
global.HTMLElement = dom.window.HTMLElement;
global.HTMLDivElement = dom.window.HTMLDivElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.CustomEvent = dom.window.CustomEvent;
global.navigator = dom.window.navigator;

// Set up prototype chain
Object.setPrototypeOf(HTMLDivElement.prototype, HTMLElement.prototype);
Object.setPrototypeOf(HTMLElement.prototype, Element.prototype);
Object.setPrototypeOf(Element.prototype, Node.prototype);

// Clean up document before each test
beforeEach(() => {
  document.body.innerHTML = '';
});

// Clean up after all tests
afterAll(() => {
  dom.window.close();
});
