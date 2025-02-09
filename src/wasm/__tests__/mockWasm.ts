import { jest, describe, test, expect } from '@jest/globals';
import type { WasmExports } from '../src/index.js';

class MemoryManager {
  private static readonly PAGE_SIZE = 64 * 1024;
  private static instance: MemoryManager | null = null;

  private _memory: WebAssembly.Memory;

  private constructor() {
    this._memory = new WebAssembly.Memory({ initial: 256, maximum: 512 });
  }

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  reset(): void {
    this._memory = new WebAssembly.Memory({ initial: 256, maximum: 512 });
  }

  get memory(): WebAssembly.Memory {
    return this._memory;
  }
}

const memoryManager = MemoryManager.getInstance();

export const mockWasmModule = {
  memory: memoryManager.memory,
  traverseDOM: jest.fn((element: number) => {
    // Mock DOM traversal
  }),
  handleAttributes: jest.fn((element: number) => {
    // Mock attribute handling
  }),
  dispatchEvents: jest.fn((element: number) => {
    // Mock event dispatch
  })
} as unknown as WasmExports;

jest.spyOn(WebAssembly, 'instantiate').mockImplementation(async () => {
  const instance = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array()), {
    env: {
      memory: memoryManager.memory
    }
  });
  Object.defineProperty(instance, 'exports', {
    value: mockWasmModule,
    enumerable: true
  });
  return instance;
});

describe('WebAssembly Mock Module', () => {
  beforeEach(() => {
    memoryManager.reset();
    mockWasmModule.memory = memoryManager.memory;
  });

  test('should mock DOM traversal', () => {
    const element = document.createElement('div');
    mockWasmModule.traverseDOM(element as unknown as number);
    expect(mockWasmModule.traverseDOM).toHaveBeenCalled();
  });

  test('should mock attribute handling', () => {
    const element = document.createElement('div');
    mockWasmModule.handleAttributes(element as unknown as number);
    expect(mockWasmModule.handleAttributes).toHaveBeenCalled();
  });

  test('should mock event dispatch', () => {
    const element = document.createElement('div');
    mockWasmModule.dispatchEvents(element as unknown as number);
    expect(mockWasmModule.dispatchEvents).toHaveBeenCalled();
  });
});
