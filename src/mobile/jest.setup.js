require('@testing-library/jest-dom');

// Mock Touch API
global.Touch = class Touch {
  constructor(init) {
    Object.assign(this, init);
  }
};

global.TouchEvent = class TouchEvent extends Event {
  constructor(type, init = {}) {
    super(type);
    this.touches = init.touches || [];
    this.targetTouches = init.targetTouches || [];
    this.changedTouches = init.changedTouches || [];
  }
};

// Clean up between tests
beforeEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
});

afterEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
  delete window.webkit;
  delete window.closureNext;
});
