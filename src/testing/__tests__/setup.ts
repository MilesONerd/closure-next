import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

declare global {
  var Cypress: {
    Commands: {
      add: jest.Mock;
    };
  };
}

beforeAll(() => {
  global.Cypress = {
    Commands: {
      add: jest.fn()
    }
  };
});

beforeEach(() => {
  if (global.Cypress?.Commands?.add) {
    global.Cypress.Commands.add.mockReset();
  }
});
