/**
 * @fileoverview Utility functions for Closure Next.
 * @license Apache-2.0
 */

import * as arrayUtils from './array';
import * as objectUtils from './object';
import * as stringUtils from './string';

// Export individual utilities
export const array = arrayUtils;
export const object = objectUtils;
export const string = stringUtils;

// Also export as a namespace
export const utils = {
  array,
  object,
  string
};
