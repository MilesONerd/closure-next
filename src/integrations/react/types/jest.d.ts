declare namespace jest {
  interface Matchers<R> {
    toHaveAttribute(attr: string, value: string): R;
  }
}
