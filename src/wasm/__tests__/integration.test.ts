import { loadWasmModule } from '../index';
import fs from 'fs';
import path from 'path';

describe('WebAssembly Integration', () => {
  let wasmModule: WebAssembly.Instance;
  
  beforeAll(async () => {
    const wasmPath = path.resolve(__dirname, '../src/closure-next.wat');
    const wasmBuffer = fs.readFileSync(wasmPath);
    wasmModule = await loadWasmModule(wasmBuffer);
  });

  test('should provide faster array operations', () => {
    const jsArray = new Array(1000000).fill(0).map((_, i) => i);
    const startJs = performance.now();
    const jsSum = jsArray.reduce((a, b) => a + b, 0);
    const endJs = performance.now();
    
    const wasmArray = new Int32Array(jsArray);
    const startWasm = performance.now();
    const wasmSum = (wasmModule.exports as any).sumArray(wasmArray, wasmArray.length);
    const endWasm = performance.now();
    
    expect(wasmSum).toBe(jsSum);
    expect(endWasm - startWasm).toBeLessThan(endJs - startJs);
  });

  test('should handle DOM traversal operations', () => {
    // Create a deep DOM tree
    const root = document.createElement('div');
    let current = root;
    for (let i = 0; i < 1000; i++) {
      const child = document.createElement('div');
      current.appendChild(child);
      current = child;
    }
    
    // JS traversal
    const startJs = performance.now();
    let jsCount = 0;
    const jsTraverse = (node: Node) => {
      jsCount++;
      node.childNodes.forEach(jsTraverse);
    };
    jsTraverse(root);
    const endJs = performance.now();
    
    // WASM traversal
    const startWasm = performance.now();
    const wasmCount = (wasmModule.exports as any).traverseDOM(root);
    const endWasm = performance.now();
    
    expect(wasmCount).toBe(jsCount);
    expect(endWasm - startWasm).toBeLessThan(endJs - startJs);
  });

  test('should optimize event handling', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    
    // JS event dispatch
    const startJs = performance.now();
    for (let i = 0; i < 10000; i++) {
      const event = new CustomEvent('test');
      element.dispatchEvent(event);
    }
    const endJs = performance.now();
    
    // WASM event dispatch
    const startWasm = performance.now();
    (wasmModule.exports as any).dispatchEvents(element, 10000);
    const endWasm = performance.now();
    
    expect(endWasm - startWasm).toBeLessThan(endJs - startJs);
    
    document.body.removeChild(element);
  });

  test('should handle component lifecycle operations', () => {
    // Create components
    const components = new Array(1000).fill(0).map(() => ({
      id: Math.random().toString(),
      state: 0,
      children: []
    }));
    
    // JS lifecycle operations
    const startJs = performance.now();
    components.forEach(comp => {
      comp.state = 1;
      comp.children = components.filter(() => Math.random() > 0.9);
    });
    const endJs = performance.now();
    
    // WASM lifecycle operations
    const startWasm = performance.now();
    (wasmModule.exports as any).updateComponents(components);
    const endWasm = performance.now();
    
    expect(endWasm - startWasm).toBeLessThan(endJs - startJs);
  });
});
