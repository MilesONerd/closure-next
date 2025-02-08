import { Component } from '@closure-next/core';
import { jest, describe, beforeEach, test, expect } from '@jest/globals';

interface CypressCommands {
  add: jest.Mock;
}

interface Global {
  Cypress: {
    Commands: CypressCommands;
  };
}

declare const global: Global;

class TestComponent extends Component {
  private title: string = 'Test Component';

  constructor() {
    super();
  }

  public createDom(): void {
    super.createDom();
    const element = this.getElement();
    if (element) {
      element.setAttribute('data-testid', 'test-component');
      element.setAttribute('data-title', this.title);
    }
  }
}

describe('Cypress Commands', () => {
  let mockCypressCommands: CypressCommands;

  beforeEach(() => {
    document.body.innerHTML = '';
    mockCypressCommands = { add: jest.fn() };
    (global as any).Cypress = { Commands: mockCypressCommands };
  });

  test('registers all Cypress commands', async () => {
    await import('../cypress');

    expect(mockCypressCommands.add).toHaveBeenCalledWith(
      'mountClosureComponent',
      expect.any(Function)
    );

    expect(mockCypressCommands.add).toHaveBeenCalledWith(
      'getClosureElement',
      { prevSubject: true },
      expect.any(Function)
    );

    expect(mockCypressCommands.add).toHaveBeenCalledWith(
      'triggerClosureEvent',
      { prevSubject: true },
      expect.any(Function)
    );

    expect(mockCypressCommands.add).toHaveBeenCalledWith(
      'shouldHaveState',
      { prevSubject: true },
      expect.any(Function)
    );
  });
});
