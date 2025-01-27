import 'jest-preset-angular/setup-jest';
import '@testing-library/jest-dom';
import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Initialize test environment
let testBed: ReturnType<typeof getTestBed>;

beforeAll(() => {
  try {
    testBed = getTestBed();
    testBed.resetTestEnvironment();
    testBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(),
      {
        teardown: { destroyAfterEach: true }
      }
    );
  } catch (e) {
    // Platform already initialized
    testBed = getTestBed();
  }
});

// Reset test environment before each test
beforeEach(() => {
  testBed = getTestBed();
  testBed.configureTestingModule({});
});

// Set up fake async zone
beforeEach(() => {
  jest.useFakeTimers();
  const proxyZoneSpec = Zone.current.get('ProxyZoneSpec');
  if (!proxyZoneSpec) {
    Zone.current.fork({
      name: 'ProxyZone',
      properties: {
        ProxyZoneSpec: {
          assertPresent: () => {}
        }
      },
      onInvoke: (parentZoneDelegate, currentZone, targetZone, delegate, applyThis, applyArgs, source) => {
        return parentZoneDelegate.invoke(targetZone, delegate, applyThis, applyArgs, source);
      }
    });
  }
});

// Import Zone.js types
/// <reference types="zone.js" />

// Set up fake async zone
beforeEach(() => {
  jest.useFakeTimers();
  const proxyZoneSpec: ZoneSpec = {
    name: 'ProxyZone',
    properties: {
      ProxyZoneSpec: {
        assertPresent: () => {}
      }
    },
    onInvoke: (
      parentZoneDelegate: ZoneDelegate,
      currentZone: Zone,
      targetZone: Zone,
      delegate: Function,
      applyThis: any,
      applyArgs?: any[],
      source?: string
    ): any => {
      return parentZoneDelegate.invoke(targetZone, delegate, applyThis, applyArgs, source);
    }
  };
  Zone.current.fork(proxyZoneSpec);
});

// Mock browser APIs
Object.defineProperty(window, 'CSS', { value: null });
Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>'
});
Object.defineProperty(document.body.style, 'transform', {
  value: () => ({
    enumerable: true,
    configurable: true
  })
});

// Mock DOM APIs
class MockRange implements Range {
  readonly START_TO_START = 0;
  readonly START_TO_END = 1;
  readonly END_TO_END = 2;
  readonly END_TO_START = 3;
  
  // Make collapsed mutable
  private _collapsed = true;
  get collapsed(): boolean { return this._collapsed; }
  
  startContainer: Node = document.createElement('div');
  endContainer: Node = document.createElement('div');
  commonAncestorContainer: Node = document.createElement('div');
  startOffset = 0;
  endOffset = 0;

  setStart(node: Node, offset: number): void {
    this.startContainer = node;
    this.startOffset = offset;
  }

  setEnd(node: Node, offset: number): void {
    this.endContainer = node;
    this.endOffset = offset;
  }

  setStartBefore(node: Node): void {
    if (node.parentNode) {
      const index = Array.from(node.parentNode.childNodes).indexOf(node as ChildNode);
      if (index !== -1) {
        this.setStart(node.parentNode, index);
      }
    }
  }

  setStartAfter(node: Node): void {
    if (node.parentNode) {
      const index = Array.from(node.parentNode.childNodes).indexOf(node as ChildNode);
      if (index !== -1) {
        this.setStart(node.parentNode, index + 1);
      }
    }
  }

  setEndBefore(node: Node): void {
    if (node.parentNode) {
      const index = Array.from(node.parentNode.childNodes).indexOf(node as ChildNode);
      if (index !== -1) {
        this.setEnd(node.parentNode, index);
      }
    }
  }

  setEndAfter(node: Node): void {
    if (node.parentNode) {
      const index = Array.from(node.parentNode.childNodes).indexOf(node as ChildNode);
      if (index !== -1) {
        this.setEnd(node.parentNode, index + 1);
      }
    }
  }

  collapse(toStart?: boolean): void {
    if (toStart) {
      this.endContainer = this.startContainer;
      this.endOffset = this.startOffset;
    } else {
      this.startContainer = this.endContainer;
      this.startOffset = this.endOffset;
    }
    this._collapsed = true;
  }

  selectNode(node: Node): void {
    this.setStartBefore(node);
    this.setEndAfter(node);
  }

  selectNodeContents(node: Node): void {
    this.startContainer = node;
    this.endContainer = node;
    this.startOffset = 0;
    this.endOffset = node.childNodes.length;
  }

  compareBoundaryPoints(how: number, sourceRange: Range): number {
    return 0;
  }

  deleteContents(): void {
    // No-op in mock
  }

  extractContents(): DocumentFragment {
    return document.createDocumentFragment();
  }

  cloneContents(): DocumentFragment {
    return document.createDocumentFragment();
  }

  insertNode(node: Node): void {
    // No-op in mock
  }

  surroundContents(newParent: Node): void {
    // No-op in mock
  }

  cloneRange(): Range {
    const range = new MockRange();
    range.startContainer = this.startContainer;
    range.endContainer = this.endContainer;
    range.startOffset = this.startOffset;
    range.endOffset = this.endOffset;
    (range as any)._collapsed = this._collapsed;
    return range;
  }

  toString(): string {
    return '';
  }

  detach(): void {
    // No-op in mock
  }

  createContextualFragment(fragment: string): DocumentFragment {
    const template = document.createElement('template');
    template.innerHTML = fragment;
    return template.content;
  }

  comparePoint(node: Node, offset: number): number {
    return 0;
  }

  intersectsNode(node: Node): boolean {
    return false;
  }

  isPointInRange(node: Node, offset: number): boolean {
    return false;
  }

  getBoundingClientRect(): DOMRect {
    return DOMRect.fromRect({ x: 0, y: 0, width: 0, height: 0 });
  }

  getClientRects(): DOMRectList {
    const rectList = {
      length: 0,
      item: (index: number) => null,
      [Symbol.iterator]: function*() {}
    };
    return Object.create(DOMRectList.prototype, {
      length: { value: rectList.length },
      item: { value: rectList.item },
      [Symbol.iterator]: { value: rectList[Symbol.iterator] }
    });
  }
}

document.createRange = () => new MockRange();

// Mock Angular specific browser APIs
global.getComputedStyle = jest.fn();
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback) => setTimeout(callback, 0);
global.cancelAnimationFrame = (id: number) => clearTimeout(id);

// Mock MutationObserver
class MockMutationObserver implements MutationObserver {
  private callback: MutationCallback;

  constructor(callback: MutationCallback) {
    this.callback = callback;
  }

  disconnect(): void {}
  observe(target: Node, options?: MutationObserverInit): void {}
  takeRecords(): MutationRecord[] { return []; }
}

global.MutationObserver = MockMutationObserver;

// Set up fake timers
beforeAll(() => {
  jest.useFakeTimers();
});

// Clean up between tests
beforeEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
  jest.clearAllTimers();
  try {
    testBed.resetTestingModule();
  } catch (e) {
    console.warn('Error resetting test module:', e);
  }
});

afterEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
  jest.clearAllTimers();
  jest.useRealTimers();
  try {
    testBed.resetTestingModule();
  } catch (e) {
    console.warn('Error resetting test module:', e);
  }
});

afterAll(() => {
  jest.useRealTimers();
});
