import { describe, test, expect } from '@jest/globals';
import { DOMHelper } from '@closure-next/core';
import { WasmComponent } from '../src';

describe('WebAssembly Integration', () => {
  let domHelper: DOMHelper;

  beforeEach(() => {
    domHelper = new DOMHelper(document);
  });

  test('creates WebAssembly component', async () => {
    const component = new WasmComponent(domHelper);
    expect(component).toBeDefined();
  });
});
