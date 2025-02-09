const { expect } = require('@jest/globals');

expect.extend({
  toHaveAttribute(element, attr, value) {
    const actualValue = element.getAttribute(attr);
    const pass = actualValue === value;
    return {
      pass,
      message: () =>
        pass
          ? `expected element not to have attribute ${attr}=${value}`
          : `expected element to have attribute ${attr}=${value} but got ${actualValue}`
    };
  }
});
