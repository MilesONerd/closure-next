/// <reference types="@testing-library/jest-dom" />

declare namespace jest {
  interface Matchers<R> {
    toHaveAttribute(attr: string, value?: string): R;
    toBeInstanceOf(constructor: Function): R;
    toBeTruthy(): R;
  }
}
