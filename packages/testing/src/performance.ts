import { Component, DomHelper, type ComponentProps } from '@closure-next/core';

/**
 * Performance test options
 */
export interface PerformanceTestOptions {
  iterations?: number;
  warmupIterations?: number;
  timeout?: number;
}

/**
 * Performance test result
 */
export interface PerformanceTestResult {
  mean: number;
  median: number;
  standardDeviation: number;
  min: number;
  max: number;
  samples: number[];
}

/**
 * Measures component render performance
 */
export async function measureRenderPerformance<T extends Component>(
  ComponentClass: new (domHelper?: DomHelper) => T,
  props?: ComponentProps,
  options: PerformanceTestOptions = {}
): Promise<PerformanceTestResult> {
  const {
    iterations = 100,
    warmupIterations = 5,
    timeout = 5000
  } = options;

  const samples: number[] = [];
  const domHelper = new DomHelper(document);

  // Warmup
  for (let i = 0; i < warmupIterations; i++) {
    const component = new ComponentClass(domHelper);
    if (props) {
      Object.entries(props).forEach(([key, value]) => {
        const method = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
        if (typeof component[method as keyof T] === 'function') {
          (component[method as keyof T] as Function)(value);
        }
      });
    }
    component.createDom();
    component.enterDocument();
    component.exitDocument();
    component.dispose();
  }

  // Actual measurements
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    const component = new ComponentClass(domHelper);
    
    if (props) {
      Object.entries(props).forEach(([key, value]) => {
        const method = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
        if (typeof component[method as keyof T] === 'function') {
          (component[method as keyof T] as Function)(value);
        }
      });
    }

    component.createDom();
    component.enterDocument();
    const end = performance.now();
    
    component.exitDocument();
    component.dispose();
    
    samples.push(end - start);

    // Check timeout
    if (end - start > timeout) {
      console.warn(`Performance test iteration ${i} exceeded timeout of ${timeout}ms`);
      break;
    }
  }

  // Calculate statistics
  samples.sort((a, b) => a - b);
  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  const median = samples[Math.floor(samples.length / 2)];
  const variance = samples.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / samples.length;
  const standardDeviation = Math.sqrt(variance);

  return {
    mean,
    median,
    standardDeviation,
    min: samples[0],
    max: samples[samples.length - 1],
    samples
  };
}

/**
 * Measures event handling performance
 */
export async function measureEventPerformance<T extends Component>(
  ComponentClass: new (domHelper?: DomHelper) => T,
  eventType: string,
  props?: ComponentProps,
  options: PerformanceTestOptions = {}
): Promise<PerformanceTestResult> {
  const {
    iterations = 100,
    warmupIterations = 5,
    timeout = 5000
  } = options;

  const samples: number[] = [];
  const domHelper = new DomHelper(document);
  const component = new ComponentClass(domHelper);

  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      const method = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
      if (typeof component[method as keyof T] === 'function') {
        (component[method as keyof T] as Function)(value);
      }
    });
  }

  component.createDom();
  component.enterDocument();

  const element = component.getElement();
  if (!element) {
    throw new Error('Component has no element');
  }

  // Warmup
  for (let i = 0; i < warmupIterations; i++) {
    const event = new Event(eventType, {
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
  }

  // Actual measurements
  for (let i = 0; i < iterations; i++) {
    const event = new Event(eventType, {
      bubbles: true,
      cancelable: true
    });

    const start = performance.now();
    element.dispatchEvent(event);
    const end = performance.now();

    samples.push(end - start);

    // Check timeout
    if (end - start > timeout) {
      console.warn(`Performance test iteration ${i} exceeded timeout of ${timeout}ms`);
      break;
    }
  }

  component.exitDocument();
  component.dispose();

  // Calculate statistics
  samples.sort((a, b) => a - b);
  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  const median = samples[Math.floor(samples.length / 2)];
  const variance = samples.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / samples.length;
  const standardDeviation = Math.sqrt(variance);

  return {
    mean,
    median,
    standardDeviation,
    min: samples[0],
    max: samples[samples.length - 1],
    samples
  };
}
