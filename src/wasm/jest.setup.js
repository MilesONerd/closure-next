require('@testing-library/jest-dom');

// Mock WebAssembly
global.WebAssembly = {
  instantiate: jest.fn().mockImplementation(async (buffer) => {
    return {
      instance: {
        exports: {
          sumArray: (arr, len) => {
            let sum = 0;
            for (let i = 0; i < len; i++) sum += arr[i];
            return sum;
          },
          traverseDOM: (node) => {
            let count = 1;
            node.childNodes.forEach(() => count++);
            return count;
          },
          dispatchEvents: (element, count) => {
            for (let i = 0; i < count; i++) {
              const event = new CustomEvent('test');
              element.dispatchEvent(event);
            }
          },
          updateComponents: (components) => {
            components.forEach(comp => {
              comp.state = 1;
              comp.children = components.filter(() => Math.random() > 0.9);
            });
          }
        }
      }
    };
  })
};

// Clean up between tests
beforeEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
});

afterEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
});
