/**
 * @fileoverview Mobile/hybrid platform integration for Closure Next.
 * @license Apache-2.0
 */

import { Component } from '@closure-next/core';
import './src/types';

interface MobileComponentOptions {
  /** Enable touch events */
  touch?: boolean;
  /** Enable gesture recognition */
  gestures?: boolean;
  /** Platform-specific styles */
  platformStyles?: boolean;
}

/**
 * Creates a mobile-optimized wrapper for a Closure component
 */
export abstract class MobileComponent extends Component {
  private touchStartX = 0;
  private touchStartY = 0;
  private isGesturing = false;
  private options: MobileComponentOptions;

  constructor(options: MobileComponentOptions = {}) {
    super();
    this.options = {
      touch: true,
      gestures: true,
      platformStyles: true,
      ...options
    };
  }

  public override createDom(): void {
    super.createDom();
    
    if (this.getElement()) {
      // Add mobile-specific attributes
      this.getElement()!.setAttribute('role', 'button');
      this.getElement()!.setAttribute('tabindex', '0');
    }

    if (this.options.touch) {
      this.enableTouchEvents();
    }
    
    if (this.options.gestures) {
      this.enableGestureRecognition();
    }
    
    if (this.options.platformStyles) {
      this.applyPlatformStyles();
    }
  }

  private enableTouchEvents(): void {
    const element = this.getElement();
    if (!element) return;

    (element as HTMLElement).addEventListener('touchstart', (e: TouchEvent) => {
      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
    });

    (element as HTMLElement).addEventListener('touchmove', (e: TouchEvent) => {
      if (this.isGesturing) {
        e.preventDefault();
      }
    });

    (element as HTMLElement).addEventListener('touchend', () => {
      this.touchStartX = 0;
      this.touchStartY = 0;
      this.isGesturing = false;
    });
  }

  private enableGestureRecognition(): void {
    const element = this.getElement();
    if (!element) return;

    (element as HTMLElement).addEventListener('touchmove', (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaX = touch.clientX - this.touchStartX;
      const deltaY = touch.clientY - this.touchStartY;

      // Detect gestures
      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        this.isGesturing = true;
        this.handleGesture(deltaX, deltaY);
      }
    });
  }

  private handleGesture(deltaX: number, deltaY: number): void {
    const element = this.getElement();
    if (!element) return;

    // Emit gesture events
    const event = new CustomEvent('gesture', {
      detail: { deltaX, deltaY }
    });
    element.dispatchEvent(event);
  }

  private applyPlatformStyles(): void {
    const element = this.getElement();
    if (!element) return;

    // Add platform-specific classes
    if (this.isIOS()) {
      element.classList.add('closure-next-ios');
    } else if (this.isAndroid()) {
      element.classList.add('closure-next-android');
    }

    // Add mobile-optimized styles
    element.classList.add('closure-next-mobile');
    const htmlElement = element as HTMLElement;
    htmlElement.style.touchAction = 'manipulation';
    (htmlElement.style as any).webkitTapHighlightColor = 'transparent';
    (htmlElement.style as any).userSelect = 'none';
  }

    private isIOS(): boolean {
      return /iPad|iPhone|iPod/.test(navigator.platform);
    }

    private isAndroid(): boolean {
      return /Android/.test(navigator.userAgent);
    }
}

/**
 * Creates a hybrid app wrapper for a Closure component
 */
export abstract class HybridComponent extends MobileComponent {
  constructor(options: MobileComponentOptions = {}) {
    super(options);
    this.setupHybridBridge();
  }

  private setupHybridBridge(): void {
    // Setup communication with native app
    window.addEventListener('message', (event) => {
      this.handleNativeMessage(event.data);
    });
  }

  private handleNativeMessage(data: any): void {
    const element = this.getElement();
    if (!element) return;

    // Handle messages from native app
    const event = new CustomEvent('native-message', {
      detail: data
    });
    (element as HTMLElement).dispatchEvent(event);
  }

  protected sendToNative(message: any): void {
    // Send message to native app
    if (window.webkit?.messageHandlers?.closureNext) {
      // iOS WebKit
      window.webkit.messageHandlers.closureNext.postMessage(message);
    } else if (window.closureNext) {
      // Android JavaScript Interface
      window.closureNext.postMessage(JSON.stringify(message));
    }
  }
}
