import { initWasm, wasmSort, wasmBinarySearch, wasmStringCompare, wasmStringEncode } from '../index.js';

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

async function benchmarkArrayOperations() {
  // Generate large array for sorting
  const largeArray = Array.from({ length: 1000000 }, () => Math.random());
  const sortedArray = [...largeArray].sort((a, b) => a - b);
  
  // Test native sort
  await runBenchmark('Native Sort (1M items)', 5, async () => {
    [...largeArray].sort((a, b) => a - b);
  });
  
  // Test WebAssembly sort
  await runBenchmark('WebAssembly Sort (1M items)', 5, async () => {
    await wasmSort(largeArray);
  });
  
  // Test native binary search
  await runBenchmark('Native Binary Search', 1000, async () => {
    sortedArray.findIndex(x => x === 0.5);
  });
  
  // Test WebAssembly binary search
  await runBenchmark('WebAssembly Binary Search', 1000, async () => {
    await wasmBinarySearch(sortedArray, 0.5);
  });
}

async function benchmarkStringOperations() {
  const str1 = 'a'.repeat(10000);
  const str2 = 'b'.repeat(10000);
  
  // Test native string compare
  await runBenchmark('Native String Compare', 1000, async () => {
    str1.localeCompare(str2);
  });
  
  // Test WebAssembly string compare
  await runBenchmark('WebAssembly String Compare', 1000, async () => {
    await wasmStringCompare(str1, str2);
  });
  
  // Test native string encode
  await runBenchmark('Native String Encode', 1000, async () => {
    new TextEncoder().encode(str1);
  });
  
  // Test WebAssembly string encode
  await runBenchmark('WebAssembly String Encode', 1000, async () => {
    await wasmStringEncode(str1);
  });
}

async function main() {
  await initWasm();
  
  console.log('Starting benchmarks...\n');
  
  await benchmarkArrayOperations();
  await benchmarkStringOperations();
  
  console.log('\nBenchmarks complete.');
  
  // TODO: Add DOM operation benchmarks once implemented
  // TODO: Add event handling benchmarks once implemented
}

main().catch(console.error);
