import { WasmComponent } from '../index';
import { DOMHelper } from '@closure-next/core';

async function runBenchmark(name: string, iterations: number, fn: () => Promise<void>) {
  console.log(`Running benchmark: ${name}`);
  const times: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    times.push(end - start);
  }
  
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  console.log(`${name}: Average time ${avg.toFixed(3)}ms`);
  return avg;
}

async function benchmarkDOMOperations() {
  const domHelper = new DOMHelper(document);
  const component = new WasmComponent(domHelper);
  const container = document.createElement('div');
  document.body.appendChild(container);
  await component.render(container);

  // Test native DOM traversal
  await runBenchmark('Native DOM Traversal', 1000, async () => {
    const elements = container.querySelectorAll('*');
    elements.forEach(el => el.getAttribute('data-test'));
  });

  // Test WebAssembly DOM traversal
  await runBenchmark('WebAssembly DOM Traversal', 1000, async () => {
    await component.traverseDOM();
  });

  // Test native attribute handling
  await runBenchmark('Native Attribute Handling', 1000, async () => {
    const elements = container.querySelectorAll('*');
    elements.forEach(el => {
      el.setAttribute('data-test', 'value');
      el.getAttribute('data-test');
      el.removeAttribute('data-test');
    });
  });

  // Test WebAssembly attribute handling
  await runBenchmark('WebAssembly Attribute Handling', 1000, async () => {
    await component.handleAttributes();
  });

  // Test native event dispatch
  await runBenchmark('Native Event Dispatch', 1000, async () => {
    const elements = container.querySelectorAll('*');
    elements.forEach(el => {
      const event = new Event('test');
      el.dispatchEvent(event);
    });
  });

  // Test WebAssembly event dispatch
  await runBenchmark('WebAssembly Event Dispatch', 1000, async () => {
    await component.dispatchEvents();
  });
}

async function main() {
  console.log('Starting benchmarks...\n');
  await benchmarkDOMOperations();
  console.log('\nBenchmarks complete.');
}

main().catch(console.error);
