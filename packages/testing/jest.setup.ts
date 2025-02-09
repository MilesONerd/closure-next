import '@testing-library/jest-dom';
import { JSDOM } from 'jsdom';

declare global {
  var JSDOM: typeof JSDOM;
}

global.JSDOM = JSDOM;
