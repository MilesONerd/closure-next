import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

global.jest = jest;

// Mock window properties
global.webkit = {
  messageHandlers: {
    closureNext: {
      postMessage: jest.fn()
    }
  }
};

global.closureNext = {
  postMessage: jest.fn()
};

// Mock getComputedStyle
window.getComputedStyle = jest.fn().mockImplementation(() => ({
  touchAction: 'manipulation',
  webkitTapHighlightColor: 'transparent',
  userSelect: 'none'
}));

// Mock message event handling
const originalAddEventListener = window.addEventListener;
window.addEventListener = jest.fn((event, handler) => {
  if (event === 'message') {
    const messageEvent = new MessageEvent('message', {
      data: { type: 'test', data: 'message' }
    });
    handler(messageEvent);
  } else {
    originalAddEventListener.call(window, event, handler);
  }
});
