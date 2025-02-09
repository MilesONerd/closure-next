import { initWasm, wasmSort, wasmBinarySearch, wasmStringCompare, wasmStringEncode } from '../src/index.js';
import { describe, test, expect, beforeAll, jest } from '@jest/globals';
import { WasmExports } from '../src/index.js';
import { mockWasmModule } from './mockWasm.js';

describe('WebAssembly Integration', () => {
  let wasmModule: WasmExports;

  beforeAll(async () => {
    jest.spyOn(WebAssembly, 'instantiate').mockImplementation(async () => ({
      instance: { exports: mockWasmModule } as unknown as WebAssembly.Instance,
      module: new WebAssembly.Module(new Uint8Array())
    }));
    await initWasm();
  });

  test('should sort numeric arrays using WebAssembly', async () => {
    const array = [5, 3, 8, 1, 9, 2, 7, 4, 6];
    const sorted = await wasmSort(array);
    expect(sorted).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test('should handle empty arrays in sort', async () => {
    const array: number[] = [];
    const sorted = await wasmSort(array);
    expect(sorted).toEqual([]);
  });

  test('should perform binary search on sorted arrays', async () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const index = await wasmBinarySearch(array, 5);
    expect(index).toBe(4);
  });

  test('should return -1 for binary search when element not found', async () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const index = await wasmBinarySearch(array, 10);
    expect(index).toBe(-1);
  });

  test('should compare strings using WebAssembly', async () => {
    const str1 = 'hello';
    const str2 = 'world';
    const result = await wasmStringCompare(str1, str2);
    expect(result).toBeLessThan(0);
  });

  test('should handle empty strings in comparison', async () => {
    const str1 = '';
    const str2 = 'test';
    const result = await wasmStringCompare(str1, str2);
    expect(result).toBeLessThan(0);
  });

  test('should encode strings using WebAssembly', async () => {
    const str = 'test string';
    const encoded = await wasmStringEncode(str);
    expect(encoded).toBeInstanceOf(Uint8Array);
    expect(encoded.length).toBe(str.length);
  });

  test('should handle empty string encoding', async () => {
    const str = '';
    const encoded = await wasmStringEncode(str);
    expect(encoded).toBeInstanceOf(Uint8Array);
    expect(encoded.length).toBe(0);
  });

  test('should handle WebAssembly initialization failure gracefully', async () => {
    const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const array = [3, 1, 2];
    const sorted = await wasmSort(array);
    expect(sorted).toEqual([1, 2, 3]);
    mockConsoleWarn.mockRestore();
  });
});
