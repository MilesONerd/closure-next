import { Component } from '@closure-next/core';

let wasmInstance: WebAssembly.Instance | null = null;

export async function initWasm(): Promise<void> {
  if (wasmInstance) return;
  
  const response = await fetch('/closure-next-wasm.wasm');
  const buffer = await response.arrayBuffer();
  const { instance } = await WebAssembly.instantiate(buffer);
  wasmInstance = instance;
}

export function wasmSort(array: number[]): number[] {
  if (!wasmInstance) throw new Error('WebAssembly not initialized');
  const typedArray = new Int32Array(array);
  (wasmInstance.exports.sort as Function)(typedArray.buffer, typedArray.length);
  return Array.from(typedArray);
}

export function wasmBinarySearch(array: number[], target: number): number {
  if (!wasmInstance) throw new Error('WebAssembly not initialized');
  const typedArray = new Int32Array(array);
  return (wasmInstance.exports.binarySearch as Function)(typedArray.buffer, typedArray.length, target);
}

export function wasmStringCompare(str1: string, str2: string): number {
  if (!wasmInstance) throw new Error('WebAssembly not initialized');
  const encoder = new TextEncoder();
  const buf1 = encoder.encode(str1);
  const buf2 = encoder.encode(str2);
  return (wasmInstance.exports.compareStrings as Function)(buf1.buffer, buf1.length, buf2.buffer, buf2.length);
}

export function wasmStringEncode(str: string): Uint8Array {
  if (!wasmInstance) throw new Error('WebAssembly not initialized');
  const encoder = new TextEncoder();
  const buf = encoder.encode(str);
  const result = new Uint8Array((wasmInstance.exports.memory as WebAssembly.Memory).buffer, 0, buf.length);
  result.set(buf);
  return result;
}
