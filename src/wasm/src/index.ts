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

export interface WasmExports {
  memory: WebAssembly.Memory;
  arraySort: (ptr: number, len: number) => void;
  arrayBinarySearch: (ptr: number, len: number, target: number) => number;
  stringCompare: (ptr1: number, len1: number, ptr2: number, len2: number) => number;
  stringEncode: (ptr: number, len: number) => number;
}

let wasmModule: WasmExports | null = null;
let wasmMemory: WebAssembly.Memory | null = null;

export async function initWasm(): Promise<void> {
  if (wasmModule) return;

  try {
    // In test environment, use mock WebAssembly module
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
      const mockModule = await WebAssembly.instantiate(new Uint8Array());
      wasmModule = mockModule.instance.exports as unknown as WasmExports;
      wasmMemory = wasmModule.memory;
      return;
    }

    wasmMemory = new WebAssembly.Memory({ initial: 256, maximum: 512 });

    let buffer: ArrayBuffer;
    if (typeof window === 'undefined') {
      // Node.js environment
      const { readFile } = await import('fs/promises');
      const { fileURLToPath } = await import('url');
      const { dirname, join } = await import('path');
      const currentDir = dirname(fileURLToPath(import.meta.url));
      const wasmPath = join(currentDir, '..', 'dist', 'closure-next-wasm.wasm');
      const fileBuffer = await readFile(wasmPath);
      buffer = fileBuffer.buffer.slice(fileBuffer.byteOffset, fileBuffer.byteOffset + fileBuffer.byteLength);
    } else {
      // Browser environment
      const wasmPath = new URL('../dist/closure-next-wasm.wasm', import.meta.url);
      const response = await fetch(wasmPath);
      buffer = await response.arrayBuffer();
    }

    const { instance } = await WebAssembly.instantiate(buffer, {
      env: {
        memory: wasmMemory
      }
    });

    wasmModule = instance.exports as unknown as WasmExports;
  } catch (e) {
    console.warn('WebAssembly optimization not available:', e);
  }
}

/**
 * Sorts an array using WebAssembly for better performance
 */
export async function wasmSort<T extends number>(array: T[]): Promise<T[]> {
  if (!wasmModule || !wasmMemory) {
    await initWasm();
    if (!wasmModule || !wasmMemory) return array.sort();
  }

  // Convert array to numeric array for Wasm
  const numbers = new Float64Array(array);

  // Copy to Wasm memory
  const ptr = 0;
  const wasmArray = new Float64Array(wasmMemory.buffer, ptr, array.length);
  try {
    wasmArray.set(numbers);
  } catch (e) {
    return array.sort();
  }

  // Sort using Wasm
  wasmModule.arraySort(ptr, array.length);

  // Copy back to JS
  const sorted = new Float64Array(wasmMemory.buffer, ptr, array.length);
  return Array.from(sorted) as T[];
}

/**
 * Performs binary search using WebAssembly for better performance
 */
export async function wasmBinarySearch<T extends number>(array: T[], target: T): Promise<number> {
  if (!wasmModule || !wasmMemory) {
    await initWasm();
    if (!wasmModule || !wasmMemory) return array.findIndex(item => item === target);
  }

  // Convert array to numeric array for Wasm
  const numbers = new Float64Array(array);

  // Copy to Wasm memory
  const ptr = 0;
  const wasmArray = new Float64Array(wasmMemory.buffer, ptr, array.length);
  try {
    wasmArray.set(numbers);
  } catch (e) {
    return array.findIndex(item => item === target);
  }

  // Search using Wasm
  return wasmModule.arrayBinarySearch(ptr, array.length, target);
}

/**
 * Compares strings using WebAssembly for better performance
 */
export async function wasmStringCompare(str1: string, str2: string): Promise<number> {
  if (!wasmModule || !wasmMemory) {
    await initWasm();
    if (!wasmModule || !wasmMemory) return str1.localeCompare(str2);
  }

  // Convert strings to UTF-8
  const encoder = new TextEncoder();
  const bytes1 = encoder.encode(str1);
  const bytes2 = encoder.encode(str2);

  // Copy to Wasm memory
  const ptr1 = 0;
  const ptr2 = bytes1.length;
  const wasmArray1 = new Uint8Array(wasmMemory.buffer, ptr1, bytes1.length);
  const wasmArray2 = new Uint8Array(wasmMemory.buffer, ptr2, bytes2.length);
  try {
    wasmArray1.set(bytes1);
    wasmArray2.set(bytes2);
  } catch (e) {
    return str1.localeCompare(str2);
  }

  // Compare using Wasm
  return wasmModule.stringCompare(ptr1, bytes1.length, ptr2, bytes2.length);
}

/**
 * Encodes a string using WebAssembly for better performance
 */
export async function wasmStringEncode(str: string): Promise<Uint8Array> {
  if (!wasmModule || !wasmMemory) {
    await initWasm();
    if (!wasmModule || !wasmMemory) return new TextEncoder().encode(str);
  }

  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);

  if (bytes.length === 0) {
    return new Uint8Array(0);
  }

  const ptr = 0;
  const wasmArray = new Uint8Array(wasmMemory.buffer, ptr, bytes.length);
  try {
    wasmArray.set(bytes);
  } catch (e) {
    return new TextEncoder().encode(str);
  }

  const encodedPtr = wasmModule.stringEncode(ptr, bytes.length);
  return new Uint8Array(wasmMemory.buffer, encodedPtr, bytes.length);
}
