import { describe, test, expect } from '@jest/globals';

export const TestComponent = {
  name: 'TestComponent',
  render() {
    return '<div>Test Component</div>';
  }
};

describe('TestComponent', () => {
  test('should have correct name', () => {
    expect(TestComponent.name).toBe('TestComponent');
  });
});
