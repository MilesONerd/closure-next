import { performance } from 'perf_hooks';
import { DOMHelper } from '@closure-next/core';
import { WasmComponent } from '../src';

async function runBenchmark(name: string, fn: () => Promise<void>, iterations: number = 1000) {
  const times: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    times.push(performance.now() - start);
  }
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  console.log(`${name}: ${avg.toFixed(3)}ms (avg of ${iterations} runs)`);
}

async function main() {
  const domHelper = new DOMHelper(document);
  const component = new WasmComponent(domHelper);

  console.log('Running WebAssembly performance benchmarks...\n');

  await runBenchmark('DOM Traversal', async () => {
    await component.traverseDOM();
  });

  await runBenchmark('Attribute Handling', async () => {
    await component.handleAttributes();
  });

  await runBenchmark('Event Dispatch', async () => {
    await component.dispatchEvents();
  });
}

main().catch(console.error);
