import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { configure } from '@testing-library/dom';

configure({ testIdAttribute: 'data-testid' });

const cleanup = () => {
  if (document && document.body) {
    document.body.innerHTML = '';
  }
};

jest.mock('@jest/globals', () => {
  const actual = jest.requireActual('@jest/globals');
  return {
    ...actual,
    beforeEach: fn => fn(),
    afterEach: fn => fn(),
    describe: (name, fn) => fn(),
    test: (name, fn) => fn(),
    expect: actual.expect
  };
});

cleanup();
jest.clearAllMocks();
