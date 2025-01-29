import { MobileComponent, HybridComponent } from '../index';
import { Component } from '@closure-next/core';

class TestMobileComponent extends MobileComponent {
  private title: string = '';
  
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

  protected override createDom(): void {
    super.createDom();
    const element = this.getElement();
    if (element) {
      element.setAttribute('data-testid', 'test-component');
      element.setAttribute('data-title', this.title);
    }
  }
}

class TestHybridComponent extends HybridComponent {
  private title: string = '';
  
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

  protected override createDom(): void {
    super.createDom();
    const element = this.getElement();
    if (element) {
      element.setAttribute('data-testid', 'test-component');
      element.setAttribute('data-title', this.title);
    }
  }
}

describe('Mobile Integration', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe('MobileComponent', () => {
    test('should handle touch events', () => {
      const component = new TestMobileComponent({ touch: true });
      component.render(container);
      
      const element = document.querySelector('[data-testid="test-component"]');
      expect(element).toBeTruthy();
      
      // Simulate touch events
      const touchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 0, clientY: 0 } as Touch]
      });
      element?.dispatchEvent(touchStart);
      
      const touchMove = new TouchEvent('touchmove', {
        touches: [{ clientX: 50, clientY: 50 } as Touch]
      });
      element?.dispatchEvent(touchMove);
      
      const touchEnd = new TouchEvent('touchend');
      element?.dispatchEvent(touchEnd);
    });

    test('should handle gestures', () => {
      const component = new TestMobileComponent({ gestures: true });
      component.render(container);
      
      const element = document.querySelector('[data-testid="test-component"]');
      expect(element).toBeTruthy();
      
      // Set up gesture event listener
      const handler = jest.fn();
      element?.addEventListener('gesture', handler);
      
      // Simulate gesture
      const touchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 0, clientY: 0 } as Touch]
      });
      element?.dispatchEvent(touchStart);
      
      const touchMove = new TouchEvent('touchmove', {
        touches: [{ clientX: 50, clientY: 50 } as Touch]
      });
      element?.dispatchEvent(touchMove);
      
      expect(handler).toHaveBeenCalled();
    });

    test('should apply platform-specific styles', () => {
      const component = new TestMobileComponent({ platformStyles: true });
      component.render(container);
      
      const element = document.querySelector('[data-testid="test-component"]');
      expect(element).toBeTruthy();
      
      // Check for mobile-specific styles
      expect(element?.classList.contains('closure-next-mobile')).toBe(true);
      
      // Check platform-specific styles
      const style = window.getComputedStyle(element as Element);
      expect(style.touchAction).toBe('manipulation');
    });
  });

  describe('HybridComponent', () => {
    test('should handle native messages', () => {
      const component = new TestHybridComponent();
      component.render(container);
      
      const element = document.querySelector('[data-testid="test-component"]');
      expect(element).toBeTruthy();
      
      // Set up message handler
      const handler = jest.fn();
      element?.addEventListener('native-message', handler);
      
      // Simulate message from native app
      window.postMessage({ type: 'test', data: 'message' }, '*');
      
      expect(handler).toHaveBeenCalled();
    });

    test('should send messages to native app', () => {
      const component = new TestHybridComponent();
      component.render(container);
      
      // Mock iOS WebKit
      (window as any).webkit = {
        messageHandlers: {
          closureNext: {
            postMessage: jest.fn()
          }
        }
      };
      
      // Send message
      (component as any).sendToNative({ type: 'test' });
      
      expect((window as any).webkit.messageHandlers.closureNext.postMessage)
        .toHaveBeenCalledWith({ type: 'test' });
    });
  });
});
