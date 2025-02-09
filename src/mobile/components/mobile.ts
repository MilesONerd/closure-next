import { Component, DOMHelper } from '@closure-next/core';
import type { MobileComponentOptions } from '../types';

export class MobileComponent<T extends Component = Component> {
  protected options: MobileComponentOptions;
  protected wrappedComponent: T;
  protected domHelper: DOMHelper;

  constructor(ComponentClass: { new(domHelper: DOMHelper): T }, options: MobileComponentOptions = {}, domHelper?: DOMHelper) {
    this.domHelper = domHelper || new DOMHelper(document);
    this.wrappedComponent = new ComponentClass(this.domHelper);
    this.options = {
      touch: true,
      gestures: true,
      platformStyles: true,
      ...options
    };
  }

  public getElement(): HTMLElement | null {
    return this.wrappedComponent.getElement();
  }

  public async render(container: HTMLElement): Promise<void> {
    // Render the wrapped component
    await this.wrappedComponent.render(container);
    
    // Apply mobile enhancements after render
    const element = this.getElement();
    if (element) {
      // Add mobile-specific attributes
      element.setAttribute('role', 'button');
      element.setAttribute('tabindex', '0');
      
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
  }

  public dispose(): void {
    // Clean up event listeners and DOM elements
    const element = this.getElement();
    if (element) {
      element.removeAttribute('role');
      element.removeAttribute('tabindex');
      element.classList.remove('closure-next-mobile', 'closure-next-ios', 'closure-next-android');
    }
    this.wrappedComponent.dispose();
  }

  private enableTouchEvents(): void {
    const element = this.getElement();
    if (!element) return;

    element.addEventListener('touchstart', (e: TouchEvent) => {
      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
    });

    element.addEventListener('touchmove', (e: TouchEvent) => {
      if (this.isGesturing) {
        e.preventDefault();
      }
    });

    element.addEventListener('touchend', () => {
      this.touchStartX = 0;
      this.touchStartY = 0;
      this.isGesturing = false;
    });
  }

  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private isGesturing: boolean = false;

  private enableGestureRecognition(): void {
    const element = this.getElement();
    if (!element) return;

    element.addEventListener('touchmove', (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaX = touch.clientX - this.touchStartX;
      const deltaY = touch.clientY - this.touchStartY;

      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        this.isGesturing = true;
        this.handleGesture(deltaX, deltaY);
      }
    });
  }

  private handleGesture(deltaX: number, deltaY: number): void {
    const element = this.getElement();
    if (!element) return;

    const event = new CustomEvent('gesture', {
      detail: { deltaX, deltaY }
    });
    element.dispatchEvent(event);
  }

  private applyPlatformStyles(): void {
    const element = this.getElement();
    if (!element) return;

    if (this.isIOS()) {
      element.classList.add('closure-next-ios');
    } else if (this.isAndroid()) {
      element.classList.add('closure-next-android');
    }

    element.classList.add('closure-next-mobile');
    element.style.touchAction = 'manipulation';
    (element.style as any).webkitTapHighlightColor = 'transparent';
    (element.style as any).userSelect = 'none';
  }

  private isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.platform);
  }

  private isAndroid(): boolean {
    return /Android/.test(navigator.userAgent);
  }
}
