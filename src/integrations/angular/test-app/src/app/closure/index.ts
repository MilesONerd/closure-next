/**
 * @fileoverview Angular integration for Closure Next.
 * @license Apache-2.0
 */

import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  NgModule,
  NgZone
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Component as ClosureComponent, DOMHelper } from '@closure-next/core';
import { InjectionToken, Type, Inject, Injectable, inject } from '@angular/core';

export const DOM_HELPER = new InjectionToken<DOMHelper>('DOM_HELPER');

interface ClosureComponentConstructor {
  new(...args: any[]): ClosureComponent;
}

/**
 * Angular directive for using Closure Next components
 */
@Injectable()
@Directive({
  selector: '[closureComponent]',
  standalone: true,
  providers: [
    { provide: DOM_HELPER, useFactory: (doc: Document) => new DOMHelper(doc), deps: [DOCUMENT] }
  ]
})
export class ClosureComponentDirective implements OnInit, OnDestroy, OnChanges {
  @Input() component!: Type<ClosureComponent>;
  @Input() props?: Record<string, unknown>;

  public instance: ClosureComponent | null = null;
  private previousProps: Record<string, unknown> = {};
  private element: HTMLElement;
  private static componentMap = new WeakMap<HTMLElement, ClosureComponent>();

  constructor(
    private readonly elementRef: ElementRef,
    private readonly ngZone: NgZone,
    @Inject(DOM_HELPER) private readonly domHelper: DOMHelper
  ) {
    this.element = elementRef.nativeElement;
  }

  private setComponentRef(component: ClosureComponent | null) {
    if (component) {
      ClosureComponentDirective.componentMap.set(this.element, component);
    } else {
      ClosureComponentDirective.componentMap.delete(this.element);
    }
  }

  private getComponentRef(): ClosureComponent | undefined {
    return ClosureComponentDirective.componentMap.get(this.element);
  }

  async ngOnInit(): Promise<void> {
    if (!this.component) {
      throw new Error('Component class must be provided');
    }

    // Create the Closure component with injected DOMHelper
    this.instance = new this.component(this.domHelper);
    
    // Store reference to Closure component
    this.setComponentRef(this.instance);

    // Apply props before rendering
    if (this.props) {
      Object.entries(this.props).forEach(([key, value]) => {
        const setter = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
        if (typeof (this.instance as any)[setter] === 'function') {
          (this.instance as any)[setter](value);
        } else if (typeof (this.instance as any)[key] === 'function') {
          (this.instance as any)[key](value);
        } else {
          (this.instance as any)[key] = value;
        }
      });
    }

    // Run rendering in NgZone
    await this.ngZone.run(async () => {
      // Render after props are applied
      this.instance!.render(this.element);

      // Wait for next tick to ensure component is fully initialized
      await new Promise(resolve => setTimeout(resolve, 0));

      // Force change detection
      this.ngZone.run(() => {});
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.instance) return;

    if (changes['props'] && !changes['props'].firstChange) {
      const props = changes['props'].currentValue || {};
      
      // Run updates inside NgZone to ensure change detection
      this.ngZone.run(() => {
        // Apply all props to ensure consistency
        Object.entries(props).forEach(([key, value]) => {
          const setter = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
          if (typeof (this.instance as any)[setter] === 'function') {
            (this.instance as any)[setter](value);
          } else if (typeof (this.instance as any)[key] === 'function') {
            (this.instance as any)[key](value);
          } else {
            (this.instance as any)[key] = value;
          }
        });

        // Re-render to ensure DOM is updated
        this.instance!.render(this.element);
      });
    }
  }

  async ngOnDestroy(): Promise<void> {
    if (this.instance) {
      await this.ngZone.run(async () => {
        // Clean up component reference before disposal
        this.setComponentRef(null);
        this.instance!.dispose();
        await new Promise(resolve => setTimeout(resolve, 0));
        this.instance = null;
      });
    }
  }
}

/**
 * Angular module for Closure Next integration
 */
@NgModule({
  declarations: [ClosureComponentDirective],
  exports: [ClosureComponentDirective],
  providers: [
    {
      provide: DOM_HELPER,
      useFactory: () => new DOMHelper(document),
      deps: [DOCUMENT]
    }
  ]
})
export class ClosureNextModule { }
