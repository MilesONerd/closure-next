import { TextEncoder, TextDecoder } from 'util';
import { jest, expect } from '@jest/globals';
import * as matchers from '@testing-library/jest-dom/matchers';
import { config } from '@vue/test-utils';

expect.extend(matchers);

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

config.global.stubs = {
  transition: false,
  'transition-group': false
};

config.global.mocks = {
  $t: (key) => key,
  $i18n: {
    locale: 'en'
  }
};
