import { jest, describe, test, expect } from '@jest/globals';
import type { WasmExports } from '../src/index.js';

class MemoryManager {
  private static readonly PAGE_SIZE = 64 * 1024;
  private static instance: MemoryManager | null = null;

  private _memory: WebAssembly.Memory;
  private _offset: number;

  private constructor(initialPages = 256) {
    const buffer = new ArrayBuffer(initialPages * 64 * 1024);
    this._memory = {
      buffer,
      grow: (pages: number) => {
        const newBuffer = new ArrayBuffer((initialPages + pages) * 64 * 1024);
        new Uint8Array(newBuffer).set(new Uint8Array(buffer));
        this._memory.buffer = newBuffer;
        return initialPages + pages;
      }
    } as WebAssembly.Memory;
    this._offset = 0;
  }

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  reset(): void {
    const buffer = new ArrayBuffer(256 * 64 * 1024);
    this._memory = {
      buffer,
      grow: (pages: number) => {
        const newBuffer = new ArrayBuffer((256 + pages) * 64 * 1024);
        new Uint8Array(newBuffer).set(new Uint8Array(buffer));
        this._memory.buffer = newBuffer;
        return 256 + pages;
      }
    } as WebAssembly.Memory;
    this._offset = 0;
  }

  get buffer(): ArrayBuffer {
    return this._memory.buffer;
  }

  get memory(): WebAssembly.Memory {
    return this._memory;
  }

  get offset(): number {
    return this._offset;
  }

  set offset(value: number) {
    this._offset = value;
  }

  allocate(size: number): number {
    const aligned = Math.ceil(size / 8) * 8;
    const currentSize = this._memory.buffer.byteLength;
    
    if (this._offset + aligned > currentSize) {
      const additionalBytes = this._offset + aligned - currentSize;
      const pages = Math.ceil(additionalBytes / MemoryManager.PAGE_SIZE);
      try {
        this._memory.grow(pages);
      } catch (e) {
        this.reset();
        return this.allocate(size);
      }
    }
    
    const ptr = this._offset;
    this._offset += aligned;
    return ptr;
  }

  reset(): void {
    this.offset = 0;
  }

  get buffer(): ArrayBuffer {
    return this.memory.buffer;
  }

  grow(pages: number): number {
    return this.memory.grow(pages);
  }
}

const memoryManager = MemoryManager.getInstance();

export const mockWasmModule = {
  memory: memoryManager.memory,
  arraySort: jest.fn((ptr: number, len: number) => {
    const array = new Float64Array(memoryManager.buffer, ptr, len);
    const sorted = Array.from(array).sort((a, b) => a - b);
    array.set(sorted);
  }),
  arrayBinarySearch: jest.fn((ptr: number, len: number, target: number) => {
    const array = new Float64Array(memoryManager.buffer, ptr, len);
    return Array.from(array).indexOf(target);
  }),
  stringCompare: jest.fn((ptr1: number, len1: number, ptr2: number, len2: number) => {
    const bytes1 = new Uint8Array(memoryManager.buffer, ptr1, len1);
    const bytes2 = new Uint8Array(memoryManager.buffer, ptr2, len2);
    const str1 = new TextDecoder().decode(bytes1);
    const str2 = new TextDecoder().decode(bytes2);
    return str1.localeCompare(str2);
  }),
  stringEncode: jest.fn((ptr: number, len: number) => {
    const bytes = new Uint8Array(memoryManager.buffer, ptr, len);
    const text = new TextDecoder().decode(bytes);
    const encoded = new TextEncoder().encode(text);
    const resultPtr = memoryManager.allocate(encoded.length);
    const resultArray = new Uint8Array(memoryManager.buffer, resultPtr, encoded.length);
    resultArray.set(encoded);
    return resultPtr;
  })
} as unknown as WasmExports;

jest.spyOn(WebAssembly, 'instantiate').mockImplementation(async () => ({
  instance: { exports: mockWasmModule } as unknown as WebAssembly.Instance,
  module: new WebAssembly.Module(new Uint8Array())
}));

describe('WebAssembly Mock Module', () => {
  beforeEach(() => {
    memoryManager.reset();
    mockWasmModule.memory = memoryManager.memory;
  });

  test('should mock array sorting', () => {
    const array = new Float64Array([3, 1, 2]);
    const ptr = memoryManager.allocate(array.length * Float64Array.BYTES_PER_ELEMENT);
    new Float64Array(memoryManager.buffer, ptr, array.length).set(array);
    mockWasmModule.arraySort(ptr, array.length);
    const result = new Float64Array(memoryManager.buffer, ptr, array.length);
    expect(Array.from(result)).toEqual([1, 2, 3]);
  });

  test('should mock binary search', () => {
    const array = new Float64Array([1, 2, 3, 4, 5]);
    const ptr = memoryManager.allocate(array.length * Float64Array.BYTES_PER_ELEMENT);
    new Float64Array(memoryManager.buffer, ptr, array.length).set(array);
    const result = mockWasmModule.arrayBinarySearch(ptr, array.length, 3);
    expect(result).toBe(2);
  });

  test('should mock string comparison', () => {
    const str1 = 'hello';
    const str2 = 'world';
    const bytes1 = new TextEncoder().encode(str1);
    const bytes2 = new TextEncoder().encode(str2);
    const ptr1 = memoryManager.allocate(bytes1.length);
    const ptr2 = memoryManager.allocate(bytes2.length);
    new Uint8Array(memoryManager.buffer, ptr1, bytes1.length).set(bytes1);
    new Uint8Array(memoryManager.buffer, ptr2, bytes2.length).set(bytes2);
    const result = mockWasmModule.stringCompare(ptr1, bytes1.length, ptr2, bytes2.length);
    expect(result).toBeLessThan(0);
  });

  test('should mock string encoding', () => {
    const str = 'test';
    const bytes = new TextEncoder().encode(str);
    const ptr = memoryManager.allocate(bytes.length);
    new Uint8Array(memoryManager.buffer, ptr, bytes.length).set(bytes);
    const resultPtr = mockWasmModule.stringEncode(ptr, bytes.length);
    const result = new Uint8Array(memoryManager.buffer, resultPtr, bytes.length);
    expect(result).toBeInstanceOf(Uint8Array);
    expect(new TextDecoder().decode(result)).toBe(str);
  });
});
