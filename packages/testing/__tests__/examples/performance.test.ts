import { Component, DomHelper } from '@closure-next/core';
import { measureRenderPerformance, measureEventPerformance } from '../../src/performance';

class TestComponent extends Component {
  constructor(domHelper?: DomHelper) {
    super(domHelper!);
  }

  private title = '';

  setTitle(title: string): void {
    this.title = title;
  }

  createDom(): void {
    const element = this.domHelper.createElement('div');
    element.textContent = this.title;
    element.setAttribute('data-testid', 'test-component');
    this.element = element;
  }
}

describe('Performance Testing Utilities', () => {
  test('measureRenderPerformance measures component rendering', async () => {
    const result = await measureRenderPerformance(TestComponent, { title: 'Performance Test' }, {
      iterations: 10,
      warmupIterations: 2
    });

    expect(result.samples).toHaveLength(10);
    expect(result.mean).toBeGreaterThan(0);
    expect(result.median).toBeGreaterThan(0);
    expect(result.standardDeviation).toBeGreaterThanOrEqual(0);
  });

  test('measureEventPerformance measures event handling', async () => {
    const result = await measureEventPerformance(TestComponent, 'click', { title: 'Event Test' }, {
      iterations: 10,
      warmupIterations: 2
    });

    expect(result.samples).toHaveLength(10);
    expect(result.mean).toBeGreaterThan(0);
    expect(result.median).toBeGreaterThan(0);
    expect(result.standardDeviation).toBeGreaterThanOrEqual(0);
  });
});
