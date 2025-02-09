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

import init, { 
  array_sort,
  array_binary_search,
  string_compare,
  string_encode
} from './dist/wasm_optimizations';

let initialized = false;
let memory: WebAssembly.Memory;

/**
 * Initializes the WebAssembly module
 */
export async function initWasm(): Promise<void> {
  if (initialized) return;

  try {
    memory = new WebAssembly.Memory({ initial: 256 });
    await init();
    initialized = true;
  } catch (e) {
    console.warn('WebAssembly optimization not available:', e);
  }
}

/**
 * Sorts an array using WebAssembly for better performance
 */
export function wasmSort<T>(array: T[]): T[] {
  if (!initialized) return array.sort();

  // Convert array to numeric array for Wasm
  const numbers = new Float64Array(array.length);
  array.forEach((value, index) => {
    numbers[index] = typeof value === 'number' ? value : 0;
  });

  // Sort using Rust-generated Wasm
  if (!memory) return array.sort();
  const view = new Float64Array(memory.buffer);
  view.set(numbers);
  array_sort(view.byteOffset, array.length);
  const result = new Float64Array(memory.buffer, view.byteOffset, array.length);
  return Array.from(result) as T[];
}

/**
 * Performs binary search using WebAssembly for better performance
 */
export function wasmBinarySearch<T>(array: T[], target: T): number {
  if (!initialized || !memory) {
    return array.findIndex(item => item === target);
  }

  // Convert array and target to numbers for Wasm
  const numbers = new Float64Array(array.length);
  array.forEach((value, index) => {
    numbers[index] = typeof value === 'number' ? value : 0;
  });
  const targetNum = typeof target === 'number' ? target : 0;

  // Search using Rust-generated Wasm
  const view = new Float64Array(memory.buffer);
  view.set(numbers);
  return array_binary_search(view.byteOffset, array.length, targetNum);
}

/**
 * Compares strings using WebAssembly for better performance
 */
export function wasmStringCompare(str1: string, str2: string): number {
  if (!initialized || !memory) {
    return str1.localeCompare(str2);
  }

  // Convert strings to UTF-8
  const encoder = new TextEncoder();
  const bytes1 = encoder.encode(str1);
  const bytes2 = encoder.encode(str2);

  // Compare using Rust-generated Wasm
  const view = new Uint8Array(memory.buffer);
  const ptr1 = 0;
  const ptr2 = bytes1.length;
  view.set(bytes1, ptr1);
  view.set(bytes2, ptr2);
  return string_compare(ptr1, bytes1.length, ptr2, bytes2.length);
}

/**
 * Encodes a string using WebAssembly for better performance
 */
export function wasmStringEncode(str: string): Uint8Array {
  if (!initialized || !memory) {
    return new TextEncoder().encode(str);
  }

  // Convert string to UTF-8
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);

  // Encode using Rust-generated Wasm
  const view = new Uint8Array(memory.buffer);
  view.set(bytes);
  const encodedPtr = string_encode(view.byteOffset, bytes.length);
  const result = new Uint8Array(memory.buffer, encodedPtr, bytes.length * 2);
  return result.slice(); // Copy the result to prevent memory issues
}
