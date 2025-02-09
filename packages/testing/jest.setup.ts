import '@testing-library/jest-dom';
import { JSDOM } from 'jsdom';

// Set up JSDOM for SSR tests
(global as any).JSDOM = JSDOM;
