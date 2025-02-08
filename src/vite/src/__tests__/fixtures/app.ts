import { describe, test, expect } from '@jest/globals';

export const AppComponent = {
  name: 'AppComponent',
  render() {
    return '<div>App Component</div>';
  }
};

describe('AppComponent', () => {
  test('should have correct name', () => {
    expect(AppComponent.name).toBe('AppComponent');
  });
});
