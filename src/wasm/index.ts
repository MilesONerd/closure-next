/**
 * @fileoverview WebAssembly optimizations for Closure Next.
 * @license Apache-2.0
 */

/**
 * Performance-critical sections that can benefit from WebAssembly:
 * 1. Array operations (sorting, searching)
 * 2. String manipulation (encoding, comparison)
 * 3. DOM traversal and manipulation
 * 4. Event handling and dispatch
 */

interface WasmModule {
  memory: WebAssembly.Memory;
  arraySort: (ptr: number, len: number) => void;
  arrayBinarySearch: (ptr: number, len: number, target: number) => number;
  stringCompare: (ptr1: number, len1: number, ptr2: number, len2: number) => number;
  stringEncode: (ptr: number, len: number) => number;
}

let wasmModule: WasmModule | null = null;

/**
 * Initializes the WebAssembly module
 */
export async function initWasm(): Promise<void> {
  if (wasmModule) return;

  try {
    const response = await fetch('/closure-next-wasm.wasm');
    const buffer = await response.arrayBuffer();
    const module = await WebAssembly.instantiate(buffer, {
      env: {
        memory: new WebAssembly.Memory({ initial: 256 })
      }
    });

    wasmModule = module.instance.exports as unknown as WasmModule;
  } catch (e) {
    console.warn('WebAssembly optimization not available:', e);
  }
}

/**
 * Sorts an array using WebAssembly for better performance
 */
export function wasmSort<T>(array: T[]): T[] {
  if (!wasmModule) return array.sort();

  // Convert array to numeric array for Wasm
  const numbers = new Float64Array(array.length);
  array.forEach((value, index) => {
    numbers[index] = typeof value === 'number' ? value : 0;
  });

  // Copy to Wasm memory
  const ptr = wasmModule.memory.buffer.byteLength;
  new Float64Array(wasmModule.memory.buffer, ptr, array.length).set(numbers);

  // Sort using Wasm
  wasmModule.arraySort(ptr, array.length);

  // Copy back to JS
  const sorted = new Float64Array(wasmModule.memory.buffer, ptr, array.length);
  return Array.from(sorted) as T[];
}

/**
 * Performs binary search using WebAssembly for better performance
 */
export function wasmBinarySearch<T>(array: T[], target: T): number {
  if (!wasmModule) {
    return array.findIndex(item => item === target);
  }

  // Convert array and target to numbers for Wasm
  const numbers = new Float64Array(array.length);
  array.forEach((value, index) => {
    numbers[index] = typeof value === 'number' ? value : 0;
  });
  const targetNum = typeof target === 'number' ? target : 0;

  // Copy to Wasm memory
  const ptr = wasmModule.memory.buffer.byteLength;
  new Float64Array(wasmModule.memory.buffer, ptr, array.length).set(numbers);

  // Search using Wasm
  return wasmModule.arrayBinarySearch(ptr, array.length, targetNum);
}

/**
 * Compares strings using WebAssembly for better performance
 */
export function wasmStringCompare(str1: string, str2: string): number {
  if (!wasmModule) {
    return str1.localeCompare(str2);
  }

  // Convert strings to UTF-8
  const encoder = new TextEncoder();
  const bytes1 = encoder.encode(str1);
  const bytes2 = encoder.encode(str2);

  // Copy to Wasm memory
  const ptr1 = wasmModule.memory.buffer.byteLength;
  const ptr2 = ptr1 + bytes1.length;
  new Uint8Array(wasmModule.memory.buffer, ptr1, bytes1.length).set(bytes1);
  new Uint8Array(wasmModule.memory.buffer, ptr2, bytes2.length).set(bytes2);

  // Compare using Wasm
  return wasmModule.stringCompare(ptr1, bytes1.length, ptr2, bytes2.length);
}

/**
 * Encodes a string using WebAssembly for better performance
 */
export function wasmStringEncode(str: string): Uint8Array {
  if (!wasmModule) {
    return new TextEncoder().encode(str);
  }

  // Convert string to UTF-8
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);

  // Copy to Wasm memory
  const ptr = wasmModule.memory.buffer.byteLength;
  new Uint8Array(wasmModule.memory.buffer, ptr, bytes.length).set(bytes);

  // Encode using Wasm
  const encodedPtr = wasmModule.stringEncode(ptr, bytes.length);
  return new Uint8Array(wasmModule.memory.buffer, encodedPtr, bytes.length);
}
