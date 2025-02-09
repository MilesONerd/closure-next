/** @jest-environment jsdom */
import { Component, DOMHelper } from '@closure-next/core';
import { MobileComponent } from '../components/mobile';
import { createReactNativeComponent } from '../react-native';
import { createIonicComponent } from '../ionic';
import { createFlutterComponent } from '../flutter';
import type { MobileComponentOptions } from '../types';

// Create a shared DOMHelper instance for tests
const testDomHelper = new DOMHelper(document);

// Add Jest types for ESM compatibility
declare const jest: any;
declare const describe: (name: string, fn: () => void) => void;
declare const test: (name: string, fn: () => void) => void;
declare const expect: any;
declare const beforeEach: (fn: () => void) => void;
declare const afterEach: (fn: () => void) => void;

// Define test component interface
interface TestComponentBase {
  getTitle(): string;
  setTitle(title: string): void;
}

class TestComponent extends Component implements TestComponentBase {
  private title: string = '';
  
  constructor(domHelper: DOMHelper) {
    super(domHelper);
  }
  
  setTitle(title: string): void {
    this.title = title;
    const element = this.getElement();
    if (element) {
      element.setAttribute('data-title', title);
    }
  }
  
  getTitle(): string {
    return this.title;
  }

  protected override async createDom(): Promise<void> {
    await super.createDom();
    const element = this.getElement();
    if (element) {
      element.setAttribute('data-testid', 'test-component');
      element.setAttribute('data-title', this.title);
    }
  }

  public override async render(container: HTMLElement): Promise<void> {
    if (!this.element) {
      await this.createDom();
    }
    if (container && this.element) {
      if (this.element.parentNode && this.element.parentNode !== container) {
        this.element.parentNode.removeChild(this.element);
      }
      if (!this.element.parentNode) {
        container.appendChild(this.element);
      }
    }
  }

  public override dispose(): void {
    if (this.isDisposed()) {
      return;
    }
    const element = this.getElement();
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
    super.dispose();
  }
}

class TestMobileComponent extends MobileComponent {
  constructor(options: MobileComponentOptions = {}) {
    super(TestComponent, options);
  }
  
  getTitle(): string {
    const component = this.getElement()?.closest('[data-testid="test-component"]');
    return component?.getAttribute('data-title') || '';
  }
  
  setTitle(title: string): void {
    const element = this.getElement();
    if (element) {
      element.setAttribute('data-title', title);
    }
  }
}

describe('Mobile Integration', () => {
  let container: HTMLElement;
  let domHelper: DOMHelper;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    domHelper = new DOMHelper(document);
  });

  afterEach(() => {
    container.remove();
  });

  describe('Framework Support', () => {
    test('should support React Native', async () => {
      const component = createReactNativeComponent(TestComponent, {
        touch: true,
        reactNative: { nativeModules: true }
      }, testDomHelper);
      expect(component).toBeInstanceOf(MobileComponent);
      
      const element = document.createElement('div');
      await component.render(element);
      expect(element.getAttribute('role')).toBe('button');
    });

    test('should support Ionic', async () => {
      const component = createIonicComponent(TestComponent, {
        touch: true,
        platformStyles: true
      }, testDomHelper);
      expect(component).toBeInstanceOf(MobileComponent);
      
      const element = document.createElement('div');
      await component.render(element);
      expect(element.getAttribute('role')).toBe('button');
    });

    test('should support Flutter Web', async () => {
      const component = createFlutterComponent(TestComponent, {
        touch: true,
        platformStyles: true
      }, testDomHelper);
      
      const element = document.createElement('div');
      await component.render(element);
      expect(element.getAttribute('role')).toBe('button');
    });
  });

  describe('Mobile Features', () => {
    let component: TestMobileComponent;
    let element: HTMLElement;

    beforeEach(async () => {
      component = new TestMobileComponent({
        touch: true,
        gestures: true,
        platformStyles: true
      });
      element = document.createElement('div');
      await component.render(element);
      container.appendChild(element);
    });

    test('should handle touch events', async () => {
      const touchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 0, clientY: 0 } as Touch]
      });
      element.dispatchEvent(touchStart);

      const touchMove = new TouchEvent('touchmove', {
        touches: [{ clientX: 50, clientY: 50 } as Touch]
      });
      element.dispatchEvent(touchMove);

      const touchEnd = new TouchEvent('touchend');
      element.dispatchEvent(touchEnd);
    });

    test('should handle gestures', async () => {
      const handler = jest.fn();
      element.addEventListener('gesture', handler);

      const touchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 0, clientY: 0 } as Touch]
      });
      element.dispatchEvent(touchStart);

      const touchMove = new TouchEvent('touchmove', {
        touches: [{ clientX: 50, clientY: 50 } as Touch]
      });
      element.dispatchEvent(touchMove);

      expect(handler).toHaveBeenCalled();
    });

    test('should apply platform-specific styles', () => {
      expect(element.classList.contains('closure-next-mobile')).toBe(true);
      expect(element.style.touchAction).toBe('manipulation');
    });

    test('should clean up resources', () => {
      component.dispose();
      expect(element.getAttribute('role')).toBeNull();
      expect(element.getAttribute('tabindex')).toBeNull();
      expect(element.classList.contains('closure-next-mobile')).toBe(false);
    });
  });
});
