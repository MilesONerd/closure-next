import { initWasm, wasmSort, wasmBinarySearch, wasmStringCompare, wasmStringEncode } from '../index.js';
import { describe, test, expect, beforeAll } from '@jest/globals';

describe('WebAssembly Integration', () => {
  beforeAll(async () => {
    await initWasm();
  });

  test('should sort arrays using WebAssembly', () => {
    const array = [5, 3, 8, 1, 9, 2, 7, 4, 6];
    const sorted = wasmSort(array);
    expect(sorted).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test('should perform binary search using WebAssembly', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const index = wasmBinarySearch(array, 5);
    expect(index).toBe(4);
  });

  test('should compare strings using WebAssembly', () => {
    const str1 = 'hello';
    const str2 = 'world';
    const result = wasmStringCompare(str1, str2);
    expect(result).toBeLessThan(0);
  });

  test('should encode strings using WebAssembly', () => {
    const str = 'test string';
    const encoded = wasmStringEncode(str);
    expect(encoded).toBeInstanceOf(Uint8Array);
    expect(encoded.length).toBeGreaterThan(0);
  });
});
